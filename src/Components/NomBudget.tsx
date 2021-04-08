import { useContext, useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { NomBudget } from '../Models';
import { AuthContext } from '../Providers/Auth';
import { getOrCreateNomBudget } from '../Services/Firestore';

interface NomBudgetProps {
    roundId: string;
}

const NomBudgetDisplay:React.FC<NomBudgetProps> = ({ roundId }) => {
    const { authedFirebaseUser: user } = useContext(AuthContext);

    const [loading, setLoading] = useState<boolean>(true);
    const [budget, setBudget] = useState<NomBudget>();

    useEffect(() => {
        if (!user) return;
        getOrCreateNomBudget(roundId, user.uid)
        .then(setBudget)
        .finally(() => setLoading(false));
    }, [roundId, user]);

    if (loading || !budget) {
        return (
            <Alert variant='info'>
                <h6>Nomination Budget</h6>
                <Spinner animation='border' variant='info' />
            </Alert>
        );
    }

    return (
        <Alert variant='info'>
            <h6>Nomination Budget</h6>
            {budget?.allowed === 0
                ? `This round has unlimited nominations. You've made ${budget.used} nominations.`
                : `You've used ${budget.used} of your ${budget.allowed} nominations.`}
        </Alert>
    );
}

export default NomBudgetDisplay