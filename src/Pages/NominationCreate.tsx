import React, { ChangeEventHandler, FormEventHandler, useContext, useState } from 'react';
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

    const handleChange:ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        const handler = e.target?.dataset?.changeProp;
        const handlers = {
            'title': setTitle,
            'spotifyURI': setSpotifyURI,
        };
        if (!handler || !(handler in handlers)) {
            throw new Error(`
                Unrecognized/missing change handler "${handler}".
                Allowed values: ${Object.keys(handlers).join(', ')}.
            `)
        }
        handlers[handler as keyof typeof handlers](e.target.value)
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