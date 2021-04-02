import React, { FormEventHandler, useContext, useState } from 'react';
import { useParams } from 'react-router';
import { Redirect } from 'react-router-dom';
import { db } from '../firebase';
import NominationForm from '../Forms/Nominations';
import { Nomination } from '../Models';
import { AuthContext } from '../Providers/Auth';
import Page from './_Base';

const NominationCreatePage:React.FC = () => {

    const { roundId } = useParams<{roundId: string}>()
    const { authedFirebaseUser: user } = useContext(AuthContext);

    const [title, setTitle] = useState<string>('');
    const [spotifyURI, setSpotifyURI] = useState<string>('');
    const [complete, setComplete] = useState<boolean>(false);

    const handleSubmit:FormEventHandler = (e) => {
        e.preventDefault();
        if (!user) {
            throw new Error(`Can't create nomination; no user`)
        }
        const data: Nomination = {
            type: 'song',  // TODO
            data: {
                title,
                spotifyURI,
            },
            points: 0,
            user: {
                uid: user.uid,
                name: user.displayName || '???',
                avatarUrl: user.photoURL || '',
            }
        };
        db.collection('rounds').doc(roundId).collection('nominations').add(data)
        .then(() => setComplete(true))
    };

    const handleChange:FormEventHandler = (e) => {
        e.preventDefault();
        const handlers = {
            'title': setTitle,
            'spotifyURI': setSpotifyURI,
        };
        //@ts-ignore
        // What's the deal with currentTarget.value
        handlers[this as unknown as keyof typeof handlers](e.currentTarget.value)
    }

    if (complete) {
        return <Redirect to={`/rounds/${roundId}/`} />
    }

    return (
        <Page>
            <h1>New Nomination</h1>
            <NominationForm
                title={title}
                spotifyURI={spotifyURI}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </Page>
    )
}

export default NominationCreatePage;