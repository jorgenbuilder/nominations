/**
 * This Gist is part of a medium article - read here:
 * https://jamiecurnow.medium.com/using-firestore-with-typescript-65bd2a602945
 */

import firebase from 'firebase/app';
import 'firebase/firestore';

// Import or define your types
import {
    Nomination,
    Round,
    Vote,
    NomBudget,
    VotBudget,
    VotSchema,
    NomSchema,
} from '../Models';

// This helper function pipes your types through a firestore converter
const converter = <T>() => ({
  toFirestore: (data: Partial<T>) => data,
  fromFirestore: (snap: firebase.firestore.QueryDocumentSnapshot) => snap.data() as T
})

// This helper function exposes a 'typed' version of firestore().collection(collectionPath)
// Pass it a collectionPath string as the path to the collection in firestore
// Pass it a type argument representing the 'type' (schema) of the docs in the collection
const dataPoint = <T>(collectionPath: string) => firebase.firestore().collection(collectionPath).withConverter(converter<T>())

// Construct a database helper object
const db = {
  // list your collections here
  rounds: dataPoint<Round>('rounds'),
  nominations: (roundId: string) => dataPoint<Nomination>(`rounds/${roundId}/nominations`),
  votes: (roundId: string, nominationId: string) => dataPoint<Vote>(`rounds/${roundId}/nominations/${nominationId}/votes`),
  nomBudgets: (roundId: string) => dataPoint<NomBudget>(`rounds/${roundId}/nomBudgets`),
  votBudgets: (roundId: string) => dataPoint<VotBudget>(`rounds/${roundId}/votBudgets`),
}

// export your helper
export { db }
export default db


// Firestore operations

const votBudgetFromSchema = (schema: VotSchema): VotBudget => {
  return Object.keys(schema).reduce((agg: VotBudget, key: string) => {
    const points = parseInt(key);
    agg[points] = {
        allowed: schema[points],
        used: 0,
        remaining: schema[points],
    };
    return agg;
}, {})
}

const getOrCreateVotBudget = async (roundId: string, userId: string): Promise<VotBudget> => {
  const budgetDoc = await db.votBudgets(roundId).doc(userId).get();
  const data = budgetDoc.data();

  if (budgetDoc.exists && data) {
      return data;
  }

  const roundDoc = await db.rounds.doc(roundId).get();
  const roundData = roundDoc.data();

  if (!roundDoc.exists || !roundData) {
      throw new Error(`That round doesn't exist!`);
  }

  const schema = roundData.votSchema;
  const budget = votBudgetFromSchema(schema);
  await db.votBudgets(roundId).doc(userId).set(budget);

  return budget;
}

export { getOrCreateVotBudget }


const nomBudgetFromSchema = (schema: NomSchema): NomBudget => {
  return {
    allowed: schema.count,
    used: 0,
    remaining: schema.count,
  }
}

const getOrCreateNomBudget = async (roundId: string, userId: string): Promise<NomBudget> => {
  const budgetDoc = await db.nomBudgets(roundId).doc(userId).get();
  const budgetData = budgetDoc.data();

  if (budgetDoc.exists && budgetData) {
      return budgetData;
  }

  const roundDoc = await db.rounds.doc(roundId).get();
  const roundData = roundDoc.data();

  if (!roundDoc.exists || !roundData) {
      throw new Error(`That round doesn't exist!`)
  }

  const schema = roundData.nomSchema;
  const budget = nomBudgetFromSchema(schema);
  await db.nomBudgets(roundId).doc(userId).set(budget);

  return budget
}

export { getOrCreateNomBudget }


const deleteVote = async (roundId: string, nominationId: string, voteId: string, userId: string) => {
  const vote = await db.votes(roundId, nominationId).doc(voteId).get();
  const voteData = vote.data();

  if (!vote.exists || !voteData) {
    throw new Error(`Can't delete vote. Doesn't exist.`);
  }

  const votBudget = await db.votBudgets(roundId).doc(userId).get();
  const votBudgetData = votBudget.data();

  if (!votBudget.exists || !votBudgetData) {
    throw new Error(`Can't delete vote. Budget doesn't exists.`)
  }

  db.votes(roundId, nominationId).doc(voteId).delete();
  db.nominations(roundId).doc(nominationId).update({
    points: firebase.firestore.FieldValue.increment(0 - voteData.points)
  });
  db.votBudgets(roundId).doc(userId).set({
    [voteData.points]: {
      used: votBudgetData[voteData.points].used - 1,
      remaining: votBudgetData[voteData.points].remaining + 1,
      allowed: votBudgetData[voteData.points].allowed,
    }
  }, { merge: true })
}

export { deleteVote }


const deleteNomination = async (roundId: string, nominationId: string, userId: string) => {
  db.nomBudgets(roundId).doc(userId).update({
    used: firebase.firestore.FieldValue.increment(-1),
    remaining: firebase.firestore.FieldValue.increment(1),
  });
  db.nominations(roundId).doc(nominationId).delete();
}

export { deleteNomination }


const voteOnNomination = async (roundId: string, nominationId: string, user: firebase.User, vote: number, existingVoteId?: string) => {
  // I decided that keying votes off user ID is cool because it's a 1 vote per user thing
  // Migrating would be a pain
  // Also, that might become undesireable at some point

  const votBudget = await db.votBudgets(roundId).doc(user.uid).get();
  const votBudgetData = votBudget.data();

  if (!votBudget.exists || !votBudgetData) {
    throw new Error(`Can't vote. Budget doesn't exist.`);
  }

  const existingVote = await db.votes(roundId, nominationId).doc(existingVoteId).get();
  const existingVoteData = existingVote.data();

  if (existingVoteId && existingVote.exists) {
    deleteVote(roundId, nominationId, existingVoteId, user.uid);
  }

  let budgetChange = Object.assign({}, votBudgetData);
  budgetChange[vote].used ++;
  budgetChange[vote].remaining --;
  
  await Promise.all([
      db.nominations(roundId).doc(nominationId).update({
          points: firebase.firestore.FieldValue.increment(existingVoteData ? vote - existingVoteData.points : vote)
      }),
      db.votes(roundId, nominationId).add({
        points: vote,
        user: {
          uid: user.uid,
          name: user.displayName || '???',
          avatarUrl: user.photoURL || '',
        }
      }),
      db.votBudgets(roundId).doc(user.uid).set(budgetChange, { merge: true })
  ])
}

export { voteOnNomination }