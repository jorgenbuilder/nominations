import {
    NomBudget,
    Round,
    VotBudget,
} from '../Models';
import { db } from '../firebase';

const FirestoreAPI = () => {

    const getOrCreateNomBudget = async (roundDocId: string, userId: string): Promise<NomBudget> => {
        const roundRef = db.collection('rounds').doc(roundDocId);
        const budgetRef = roundRef.collection('nomBudgets').doc(userId);
        const budgetDoc = await budgetRef.get();

        if (budgetDoc.exists) {
            return budgetDoc.data() as NomBudget;
        }

        const roundDoc = await roundRef.get();

        if (!roundDoc.exists) {
            throw new Error(`That round doesn't exist!`)
        }

        const round = roundDoc.data() as Round;
        const budget = {
            allowed: round.nomSchema.count,
            used: 0,
            remaining: round.nomSchema.count,
        }
        await budgetRef.set(budget);

        return budget
    }

    const getOrCreateVotBudget = async (roundDocId: string, userId: string): Promise<VotBudget> => {
        const roundRef = db.collection('rounds').doc(roundDocId);
        const budgetRef = roundRef.collection('votBudgets').doc(userId);
        const budgetDoc = await budgetRef.get();

        if (budgetDoc.exists) {
            return budgetDoc.data() as VotBudget;
        }

        const roundDoc = await roundRef.get();

        if (!roundDoc.exists) {
            throw new Error(`That round doesn't exist!`);
        }

        const round = roundDoc.data() as Round;
        const schema = round.votSchema;
        const budget: VotBudget = Object.keys(schema).reduce((agg: VotBudget, key: string) => {
            const points = parseInt(key);
            agg[points] = {
                allowed: schema[points],
                used: 0,
                remaining: schema[points],
            };
            return agg;
        }, {})
        await budgetRef.set(budget);

        return budget;
    }

    const updateNomBudget = (roundDocId: string, userId: string, update: Partial<NomBudget>) => {
        const budgetRef = db.collection('rounds').doc(roundDocId)
        .collection('nomBudgets').doc(userId);
        const budgetDoc = budgetRef.get();

        if (!budgetDoc) {
            throw new Error(`Attempt to update budget which doesn't exist`);
        }

        budgetRef.update(update);
    }

    const updateVotBudget = (roundDocId: string, userId: string, update: Partial<VotBudget>) => {
        const budgetRef = db.collection('rounds').doc(roundDocId)
        .collection('votBudgets').doc(userId);
        const budgetDoc = budgetRef.get();

        if (!budgetDoc) {
            throw new Error(`Attempt to update budget which doesn't exist`);
        }

        budgetRef.update(update);
    }

    const validateNomBudget = (object: NomBudget): string[] => {
        const errors: string[] = [];
        return errors;
    }

    const validateVotBudget = (object: VotBudget): string[] => {
        const errors: string[] = [];
        return errors;
    }

    return {
        getOrCreateNomBudget,
        getOrCreateVotBudget,
        updateNomBudget,
        updateVotBudget,
        validateNomBudget,
        validateVotBudget,
    }
}

export default FirestoreAPI();