import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { Round } from '../Models';
import routes from '../routes';
import LoadingPage from './Loading';
import Page from './_Base';

const RoundListPage:React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [rounds, setRounds] = useState<any>(null);
    
    useEffect(() => {
        document.title = 'Nomination Rounds';
        db.collection('rounds').get()
        .then((collection) => {
            setRounds(collection.docs);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <LoadingPage />;
    }

    const roundsDOM = (rounds.length)
        ? <ListGroup style={{marginBottom: '1em'}}>
            {rounds.map((round: any) => {
                const data: Round = round.data();
                return <ListGroup.Item key={round.id}>
                    <Link to={`/rounds/${round.id}`}>{data.name}</Link>
                </ListGroup.Item>
            })}
        </ListGroup>
        : <>No rounds yet!</>;

    return (
        <Page>
            <Breadcrumb>
                <Breadcrumb.Item>Rounds</Breadcrumb.Item>
            </Breadcrumb>
            <h1 style={{marginBottom: '1em'}}>Nomination Rounds</h1>
            {roundsDOM}
            <Link to={routes.roundCreate.path}>
                <Button>Create a nomination round</Button>
            </Link>
        </Page>
    );
}

export default RoundListPage;