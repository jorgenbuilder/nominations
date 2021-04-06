import React, { useEffect, useState } from 'react';
import { Badge, Breadcrumb, Button, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import VotBudget from '../Components/VotBudget';
import NomBudget from '../Components/NomBudget';
import { db } from '../firebase';
import { Nomination, Round } from '../Models';
import LoadingPage from './Loading';
import Page from './_Base';

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
            document.title = data.name;
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
        <Page>
            <Breadcrumb>
                <Breadcrumb.Item href={`/rounds/`}>Rounds</Breadcrumb.Item>
                <Breadcrumb.Item>{round.name}</Breadcrumb.Item>
            </Breadcrumb>
            <h1 style={{marginBottom: '1em'}}>{round.name}</h1>

            <h2 style={{marginBottom: '.5em'}}>Nominations</h2>
            <ListGroup style={{marginBottom: '1em'}}>
                {nominations.length
                    ? nominations.map((nomination: any) => {
                        const data: Nomination = nomination.data();
                        return <ListGroup.Item key={nomination.id}>
                            <Link to={`/rounds/${roundId}/nomination/${nomination.id}`} style={{display: 'block'}}>
                                {data.data.title}
                                <Badge style={{float: 'right'}} variant="primary">{data.points}</Badge>
                            </Link>
                        </ListGroup.Item>
                    })
                    : <ListGroup.Item>
                        No nominations yet!
                    </ListGroup.Item>
                }
            </ListGroup>
            <VotBudget roundId={roundId} />
            <NomBudget roundId={roundId} />
            <Link to={`/rounds/${roundId}/nomination/create`}>
                <Button>Nominate a {round.nomSchema.type}</Button>
            </Link>
        </Page>
    )
}

export default RoundDetailPage;