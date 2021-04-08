import { useContext, useEffect, useState } from 'react';
import { Alert, Badge, Spinner } from 'react-bootstrap';
import { VotBudget } from '../Models';
import { AuthContext } from '../Providers/Auth';
import { getOrCreateVotBudget } from '../Services/Firestore';

interface VotBudgetProps {
    roundId: string;
}

const VotBudgetDisplay:React.FC<VotBudgetProps> = ({ roundId }) => {
    const { authedFirebaseUser: user } = useContext(AuthContext);

    const [loading, setLoading] = useState<boolean>(true);
    const [budget, setBudget] = useState<VotBudget>();

    useEffect(() => {
        if (!user) return;
        getOrCreateVotBudget(roundId, user.uid)
        .then(setBudget)
        .finally(() => setLoading(false));
    }, [roundId, user]);

    if (loading || !budget) {
        return (
            <Alert variant='info'>
                <h6>Vote Budget</h6>
                <Spinner animation='border' variant='info' />
            </Alert>
        );
    }
    const budgetNodes = Object.keys(budget).map((key: string) => {
        const points = parseInt(key);
        const data = budget[points];
        return <li key={`votBudgetNode-${key}`}>
            <span style={{marginRight: '.5em'}}>{points} Point{points > 1 ? 's' : ''}:</span>
            <Badge variant='success'>{data.used}</Badge> / <Badge variant='primary'>{data.allowed}</Badge>
        </li>
    });

    return (
        <Alert variant='info'>
            <h6>Vote Budget</h6>
            <ul style={{marginBottom: '0'}}>
                {budgetNodes}
            </ul>
        </Alert>
    );
}

export default VotBudgetDisplay