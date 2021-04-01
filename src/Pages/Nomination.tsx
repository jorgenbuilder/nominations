import firebase from 'firebase';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import React, { FormEventHandler, useEffect, useState } from 'react';
import { Badge, Button, Form, ListGroup } from 'react-bootstrap';
import { Redirect, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { Nomination, Round, Vote } from '../Models';

const NominationPage:React.FC = () => {
    const { roundId, nominationId } = useParams<{roundId: string, nominationId: string}>();

    const [loading, setLoading] = useState<boolean>(true);
    const [round, setRound] = useState<Round>();
    const [nomination, setNomination] = useState<Nomination>();
    const [votes, setVotes] = useState<any>();
    const [userVote, setUserVote] = useState<any>();
    const [complete, setComplete] = useState<boolean>(false);

    const handleSubmit:FormEventHandler = (e) => {
        e.preventDefault();
        //@ts-ignore
        const userName = document.querySelector('#user-name')?.value;
        //@ts-ignore
        const userPhoto = document.querySelector('#user-photo')?.value;
        const data: Vote = {
            points: userVote,
            user: {
                name: userName,
                avatarUrl: userPhoto,
            }
        };
        const userExistingVote = votes.find((x: any) => x.data().user.name === userName)
        if (userExistingVote) {
            db.collection('rounds').doc(roundId).collection('nominations').doc(nominationId).collection('votes').doc(userExistingVote.id).delete()
        }
        Promise.all([
            db.collection('rounds').doc(roundId).collection('nominations').doc(nominationId).update({
                points: firebase.firestore.FieldValue.increment(userExistingVote ? userVote - userExistingVote.data().points : userVote)
            }),
            db.collection('rounds').doc(roundId).collection('nominations').doc(nominationId).collection('votes').add(data),
        ])
        .then(() => setComplete(true));
    }

    useEffect(() => {
        Promise.all([
            db.collection('rounds').doc(roundId).get(),
            db.collection('rounds').doc(roundId).collection('nominations').doc(nominationId).get(),
            db.collection('rounds').doc(roundId).collection('nominations').doc(nominationId).collection('votes').get(),
        ]).then(([roundDoc, nominationDoc, votes]) => {
            //@ts-ignore
            const roundData: Round = roundDoc.data();
            setRound(roundData);
            //@ts-ignore
            const nominationData: Nomination = nominationDoc.data();
            setNomination(nominationData);
            setVotes(votes.docs);
            setLoading(false);
        })
    }, [roundId, nominationId]);

    if (complete) {
        return <Redirect to={`/rounds/${roundId}/`} />;
    }

    if (loading || !round || !nomination) {
        return <>
            <p>Loading...</p>
        </>;
    }

    const [_, entity, id] = nomination.data.spotifyURI.split(':');
    console.log(`I didn't use ${_}.`)

    console.log(nomination.data.spotifyURI.indexOf('spotify.com'));
    const src = nomination.data.spotifyURI.indexOf('spotify.com') > -1
        ? nomination.data.spotifyURI.replace('.com/', '.com/embed/')
        : `https://open.spotify.com/embed/${entity}/${id}`;
    
    return (
        <>
            <FirebaseAuthConsumer>
                {({ user }) => {
                    return <>
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
                        <h2 style={{marginBottom: '.5em'}}>Votes</h2>
                        {votes.length
                            ? <ListGroup style={{marginBottom: '2em'}}>
                                {votes.map((vote: any) => {
                                    const data: Vote = vote.data();
                                    return <ListGroup.Item>
                                        <img width="34" style={{marginRight: '.5em'}} src={data.user.avatarUrl} alt="User" />
                                        {data.user.name}
                                        <Badge style={{float: 'right'}} variant="primary">{data.points}</Badge>
                                    </ListGroup.Item>
                                })}
                                <ListGroup.Item>
                                    <strong>Total</strong>
                                    <Badge style={{float: 'right'}} variant="primary">{nomination.points}</Badge>
                                </ListGroup.Item>
                            </ListGroup>
                            : <div style={{marginBottom: '1em'}}>No votes yet</div>}
                        <h2 style={{marginBottom: '.5em'}}>Your Vote</h2>
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
                                        id={`asdfasdf-${key}`}
                                        //@ts-ignore
                                        label={`${key} Point`}
                                    />
                                })}
                                <Form.Check 
                                    type='radio'
                                    name={`vote`}
                                    value={`0`}
                                    id={`asdfasdf-0`}
                                    //@ts-ignore
                                    label={`No vote`}
                                />
                            </div>
                            <input type="hidden" id="user-name" value={user.displayName} />
                            <input type="hidden" id="user-photo" value={user.photoURL} />
                            <Button type="submit">Vote</Button>
                        </Form>
                    </>
                }}
            </FirebaseAuthConsumer>
        </>
    )
}

export default NominationPage;