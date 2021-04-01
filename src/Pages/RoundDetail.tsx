import React, { useEffect, useState } from 'react';
import { Badge, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { Nomination, Round } from '../Models';

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
        db.collection('rounds').doc(roundId).collection('nominations').get()
        .then((nominations) => {
            setNominations(nominations.docs);
            setLoadingNominations(false);
        });
    }, [roundId]);

    if (loading || !round) {
        return <>
            <p>Loading...</p>
        </>;
    }

    return (
        <>
            <h1>{round.name}</h1>

            <h2>The Rules</h2>
            <ul>
                <li>Nominate up to {round.nomSchema.count} {round.nomSchema.type}s</li>
                <li>Everyone gets {Object.keys(round.votSchema).map(key => {
                    const points = key;
                    //@ts-ignore
                    const count = round.votSchema[key];
                    return `${count} votes worth ${points} points`
                }).join(', ')}.</li>
            </ul>

            <h2>Nominations</h2>
            {loadingNominations
                ? 'Loading...'
                : nominations.length
                    ? <ListGroup>
                        {nominations.map((nomination: any) => {
                            const data: Nomination = nomination.data();
                            return <ListGroup.Item key={nomination.id}>
                                <Link to={`/rounds/${roundId}/nomination/${nomination.id}`}>{data.data.title}</Link>
                                <Badge variant="primary">{data.points}</Badge>
                            </ListGroup.Item>
                        })}
                    </ListGroup>
                    : 'No nominations yet!'
            }
            <p>
                <Link to={`/rounds/${roundId}/nomination/create`}>Nominate a {round.nomSchema.type}</Link>
            </p>
        </>
    )
}

export default RoundDetailPage;