import firebase from 'firebase';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import { FormEventHandler, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
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
    
    return (
        <>
            <FirebaseAuthConsumer>
                {({ user }) => {
                    return <>
                        <h1>{nomination.data.title}</h1>
                        <iframe
                            title="spotify embed"
                            src={`https://open.spotify.com/embed/${entity}/${id}`}
                            width="300"
                            height="380"
                            frameBorder="0"
                            allowTransparency={true}
                            allow="encrypted-media"
                        />
                        <h2>Votes</h2>
                        {votes.length
                            ? <ul>
                                {votes.map((vote: any) => {
                                    const data: Vote = vote.data();
                                    return <li>
                                        <img src={data.user.avatarUrl} alt="User" />
                                        {data.user.name} voted {data.points}
                                    </li>
                                })}
                            </ul>
                            : "No votes yet"}
                        <h2>Your Vote</h2>
                        <Form onSubmit={handleSubmit}>
                            <div onChange={(e) => {
                                //@ts-ignore
                                setUserVote(e.target.value)
                            }}>
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