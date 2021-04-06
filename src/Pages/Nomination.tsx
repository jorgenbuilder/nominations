import firebase from 'firebase';
import { AuthContext } from '../Providers/Auth';
import React, { FormEventHandler, MouseEventHandler, useContext, useEffect, useState } from 'react';
import { Badge, Breadcrumb, Button, Form, ListGroup } from 'react-bootstrap';
import { Redirect, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { VotBudget, Nomination, Round, Vote } from '../Models';
import LoadingPage from './Loading';
import Page from './_Base';
import VotBudgetDisplay from '../Components/VotBudget';
import FirestoreAPI from '../Services/FirestoreAPI';

const NominationPage:React.FC = () => {
    const { authedFirebaseUser: user } = useContext(AuthContext);
    const { roundId, nominationId } = useParams<{roundId: string, nominationId: string}>();

    const [loading, setLoading] = useState<boolean>(true);
    const [round, setRound] = useState<Round>();
    const [nomination, setNomination] = useState<Nomination>();
    const [votes, setVotes] = useState<firebase.firestore.QueryDocumentSnapshot<Vote>[]>();
    const [userVote, setUserVote] = useState<number>();
    const [complete, setComplete] = useState<boolean>(false);
    const [votBudget, setVotBudget] = useState<VotBudget>();

    const userExistingVote = votes?.find((x: any) => x.data().user.name === user?.displayName);

    const handleSubmit:FormEventHandler = (e) => {
        e.preventDefault();
        if (!user || !userVote) {
            throw new Error('Can\'t vote; no user.');
        }
        let budgetChange = Object.assign({}, votBudget);
        if (userExistingVote) {
            db.collection('rounds').doc(roundId).collection('nominations').doc(nominationId).collection('votes').doc(userExistingVote.id).delete()
            const key = userExistingVote.data().points;
            budgetChange[key] = {
                allowed: budgetChange[key].allowed,
                used: budgetChange[key].used - 1,
                remaining: budgetChange[key].remaining + 1,
            };
        }
        const data: Vote = {
            points: userVote,
            user: {
                uid: user.uid || undefined,
                name: user.displayName || '???',
                avatarUrl: user.photoURL || '',
            }
        };
        budgetChange[userVote].used = budgetChange[userVote].used + 1;
        budgetChange[userVote].remaining = budgetChange[userVote].remaining - 1;
        setVotBudget(budgetChange);
        
        Promise.all([
            db.collection('rounds').doc(roundId).collection('nominations').doc(nominationId).update({
                points: firebase.firestore.FieldValue.increment(userExistingVote ? userVote - userExistingVote.data().points : userVote)
            }),
            db.collection('rounds').doc(roundId).collection('nominations').doc(nominationId).collection('votes').add(data),
            FirestoreAPI.updateVotBudget(roundId, user.uid, budgetChange),
        ])
        .then(() => setComplete(true));
    }

    const handleDeleteVote:MouseEventHandler = (e) => {
        e.preventDefault();
        if (!user || !votBudget) return;
        if (userExistingVote) {
            db.collection('rounds').doc(roundId).collection('nominations').doc(nominationId).collection('votes').doc(userExistingVote.id).delete()
            db.collection('rounds').doc(roundId).collection('nominations').doc(nominationId).update({
                points: firebase.firestore.FieldValue.increment(0 - userExistingVote.data().points)
            });

            let budgetChange = Object.assign({}, votBudget);
            const key = userExistingVote.data().points;
            budgetChange[key] = {
                allowed: budgetChange[key].allowed,
                used: budgetChange[key].used - 1,
                remaining: budgetChange[key].remaining + 1,
            };
            FirestoreAPI.updateVotBudget(roundId, user.uid, budgetChange);
            setVotBudget(budgetChange);

            if (votes) {
                let v = [...votes];
                const i = v.indexOf(userExistingVote);
                v.splice(i, 1);
                setVotes(v);
            }
        }
    }

    useEffect(() => {
        if (!user) {
            return
        }

        Promise.all([
            db.collection('rounds').doc(roundId).get(),
            db.collection('rounds').doc(roundId).collection('nominations').doc(nominationId).get(),
            db.collection('rounds').doc(roundId).collection('nominations').doc(nominationId).collection('votes').get(),
            FirestoreAPI.getOrCreateVotBudget(roundId, user.uid),
        ]).then(([roundDoc, nominationDoc, votes, votBudget]) => {
            //@ts-ignore
            const roundData: Round = roundDoc.data();
            setRound(roundData);
            //@ts-ignore
            const nominationData: Nomination = nominationDoc.data();
            setNomination(nominationData);
            //@ts-ignore
            setVotes(votes.docs);
            setUserVote(votes.docs.find((x: any) => x.data().user.name === user?.displayName)?.data()?.points);
            setVotBudget(votBudget);
            setLoading(false);
            document.title = nominationData.data.title
        })
    }, [roundId, nominationId, user]);

    if (complete) {
        return <Redirect to={`/rounds/${roundId}/`} />;
    }

    if (loading || !round || !nomination) {
        return <LoadingPage />;
    }

    const [, entity, id] = nomination.data.spotifyURI.split(':');
    const src = nomination.data.spotifyURI.indexOf('spotify.com') > -1
        ? nomination.data.spotifyURI.replace('.com/', '.com/embed/')
        : `https://open.spotify.com/embed/${entity}/${id}`;
    
    return (
        <Page>
            <Breadcrumb>
                <Breadcrumb.Item href={`/rounds/`}>Rounds</Breadcrumb.Item>
                <Breadcrumb.Item href={`/rounds/${roundId}/`}>{round.name}</Breadcrumb.Item>
                <Breadcrumb.Item>{nomination.data.title}</Breadcrumb.Item>
            </Breadcrumb>
            <h1 style={{marginBottom: '1em'}}>{nomination.data.title}</h1>
            <iframe
                title="spotify embed"
                src={src}
                width="100%"
                height="380"
                frameBorder="0"
                allowTransparency={true}
                allow="encrypted-media"
                style={{marginBottom: '1em'}}
            />
            {nomination.user
                ? <p>Nominated by {nomination.user.name}</p>
                : ''}
            <h2 style={{marginBottom: '.5em'}}>Votes</h2>
            {votes?.length
                ? <ListGroup style={{marginBottom: '2em'}}>
                    {votes.map((vote: any) => {
                        const data: Vote = vote.data();
                        return <ListGroup.Item>
                            <img width="34" style={{marginRight: '.5em'}} src={data.user.avatarUrl} alt="User" />
                            {data.user.name} 
                            {vote === userExistingVote
                            ? <a href="#delete" style={{marginLeft: '1em'}} onClick={handleDeleteVote}>Delete</a>
                            : ''}
                            <Badge style={{float: 'right'}} variant="primary">{data.points}</Badge>
                        </ListGroup.Item>
                    })}
                    <ListGroup.Item>
                        <strong>Total</strong>
                        <Badge style={{float: 'right'}} variant="primary">{votes.reduce((prev: number, curr, i) => prev + parseInt(`${curr.data().points}`), 0)}</Badge>
                    </ListGroup.Item>
                </ListGroup>
                : <div style={{marginBottom: '1em'}}>No votes yet</div>}
            <h2 style={{marginBottom: '.5em'}}>Your Vote</h2>
            <VotBudgetDisplay roundId={roundId} />
            <Form onSubmit={handleSubmit}>
                <div onChange={(e) => {
                    //@ts-ignore
                    setUserVote(e.target.value)
                }}
                style={{marginBottom: '1em'}}
                >
                    {Object.keys(round.votSchema).map((key: string) => {
                        return <Form.Check 
                            type='radio'
                            name={`vote`}
                            value={`${key}`}
                            defaultChecked={`${userVote || ''}` === `${key}`}
                            id={`asdfasdf-${key}`}
                            //@ts-ignore
                            label={`${key} Point`}
                        />
                    })}
                </div>
                <Button type="submit">Vote</Button>
            </Form>
        </Page>
    )
}

export default NominationPage;