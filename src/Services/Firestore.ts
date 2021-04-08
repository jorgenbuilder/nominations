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