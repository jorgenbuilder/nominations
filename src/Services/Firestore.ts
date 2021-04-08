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

/**
 * Some examples of how to use:
 */

// const example = async (id: string) => {
//   // firestore just as you know it, but with types
//   const userDoc = await db.users.doc(id).get()
//   const { blackLivesMatter } = userDoc.data()
//   return blackLivesMatter === true // obviously
// }

// const createExample = async (userId: string) => {
//   await db.userPosts(userId).doc().create({
//     something: false,
//     somethingElse: true
//   })
// }

// // Always use set for updates as firestore doesn't type update function correctly yet!
// const updateExample = async (id: string) => {
//   await db.users.doc(id).set({
//     firstName: 'Jamie',
//     blackLivesMatter: true
//   }, { merge: true })
// }