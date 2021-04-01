import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { Round } from '../Models';
import routes from '../routes';

const RoundListPage:React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [rounds, setRounds] = useState<any>(null);
    
    useEffect(() => {
        db.collection('rounds').get()
        .then((collection) => {
            setRounds(collection.docs);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <>
            <h1>Nomination Rounds</h1>
            <p>Loading...</p>
        </>;
    }

    const roundsDOM = (rounds.length)
        ? <ListGroup>
            {rounds.map((round: any) => {
                const data: Round = round.data();
                return <ListGroup.Item key={round.id}>
                    <Link to={`/rounds/${round.id}`}>{data.name}</Link>
                </ListGroup.Item>
            })}
        </ListGroup>
        : <>No rounds yet!</>;

    return (
        <>
            <h1>Nomination Rounds</h1>
            {roundsDOM}
            <p>
                <Link to={routes.roundCreate.path}>Create a nomination round</Link>
            </p>
        </>
    );
}

export default RoundListPage;