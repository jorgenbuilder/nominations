import React, { useEffect, useState } from 'react';
import { Badge, Button, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { Nomination, Round } from '../Models';
import LoadingPage from './Loading';

const RoundDetailPage:React.FC = () => {
    const { roundId } = useParams<{roundId: string}>();
    const [loading, setLoading] = useState<boolean>(true);
    const [round, setRound] = useState<Round>();
    const [nominations, setNominations] = useState<any>();
    const [loadingNominations, setLoadingNominations] = useState<boolean>(true);
    
    useEffect(() => {
        db.collection('rounds').doc(roundId).get()
        .then((roundDoc) => {
            //@ts-ignore
            const data: Round = roundDoc.data();
            setRound(data);
            setLoading(false);
        });
        db.collection('rounds').doc(roundId).collection('nominations').orderBy('points', 'desc').get()
        .then((nominations) => {
            setNominations(nominations.docs);
            setLoadingNominations(false);
        });
    }, [roundId]);

    if (loading || !round || loadingNominations) {
        return <LoadingPage />;
    }

    return (
        <>
            <h1 style={{marginBottom: '1em'}}>{round.name}</h1>

            <h2>The Rules</h2>
            <ul style={{marginBottom: '1em'}}>
                <li>Nominate up to {round.nomSchema.count} {round.nomSchema.type}s</li>
                <li>Everyone gets {Object.keys(round.votSchema).map(key => {
                    const points = key;
                    //@ts-ignore
                    const count = round.votSchema[key];
                    return `${count} votes worth ${points} points`
                }).join(', ')}.</li>
            </ul>

            <h2 style={{marginBottom: '.5em'}}>Nominations</h2>
            {nominations.length
                ? <ListGroup style={{marginBottom: '1em'}}>
                    {nominations.map((nomination: any) => {
                        const data: Nomination = nomination.data();
                        return <ListGroup.Item key={nomination.id}>
                            <Link to={`/rounds/${roundId}/nomination/${nomination.id}`} style={{display: 'block'}}>
                                {data.data.title}
                                <Badge style={{float: 'right'}} variant="primary">{data.points}</Badge>
                            </Link>
                        </ListGroup.Item>
                    })}
                </ListGroup>
                : 'No nominations yet!'
            }
            <Link to={`/rounds/${roundId}/nomination/create`}>
                <Button>Nominate a {round.nomSchema.type}</Button>
            </Link>
        </>
    )
}

export default RoundDetailPage;