import React, { useContext, useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../Providers/Auth';
import db from '../Services/Firestore';

const OutstandingVotes:React.FC = () => {

    const { roundId } = useParams<{roundId?: string}>();

    const [loading, setLoading] = useState<boolean>(true);
    const [votes, setVotes] = useState<number>();


    if (!roundId) {
        throw new Error(`Can't render outstanding votes outside of a round path.`);
    }

    useEffect(() => {
        db.votBudgets(roundId).get()
        .then(value => {
            const count = value.docs.reduce((agg: number, current) => {
                const data = current.data();
                Object.keys(data).forEach((key: unknown) => {
                    agg = agg + data[key as number].remaining
                });
                return agg
            }, 0);
            setVotes(count);
            setLoading(false);
        });
    })

    if (loading || !votes) {
        return (
            <Alert variant='info'>
                <h6>Outstanding Votes</h6>
                <Spinner animation='border' variant='info' />
            </Alert>
        );
    }
    
    return (
        <Alert variant='info'>
            <h6>Oustanding Votes</h6>
            {votes > 0
                ? <p>There are {votes} outstanding votes.</p>
                : <p>All the votes are in!</p>
            }
        </Alert>
    );
}

export default OutstandingVotes;