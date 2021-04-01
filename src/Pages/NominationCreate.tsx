import React, { FormEventHandler, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router';
import { Redirect } from 'react-router-dom';
import { db } from '../firebase';
import { Nomination } from '../Models';

const NominationCreatePage:React.FC = () => {

    const { roundId } = useParams<{roundId: string}>()
    const [title, setTitle] = useState<string>('');
    const [spotifyURI, setSpotifyURI] = useState<string>('');
    const [complete, setComplete] = useState<boolean>(false);

    const handleSubmit:FormEventHandler = (e) => {
        e.preventDefault();
        const data: Nomination = {
            type: 'song',  // TODO
            data: {
                title,
                spotifyURI,
            },
            points: 0,
        };
        console.log(data)
        db.collection('rounds').doc(roundId).collection('nominations').add(data)
        .then(() => setComplete(true))
    };

    if (complete) {
        return <Redirect to={`/rounds/${roundId}/`} />
    }

    return (
        <>
            <h1>New Nomination</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Label>
                    Title
                </Form.Label>
                <Form.Control value={title} onChange={(e) => setTitle(e.currentTarget.value)} type="text" />
                <Form.Label>
                    Spotify URL
                </Form.Label>
                <Form.Control value={spotifyURI} onChange={(e) => setSpotifyURI(e.currentTarget.value)} type="text" />
                <Button variant="primary" type="submit">
                    Create
                </Button>
            </Form>
        </>
    )
}

export default NominationCreatePage;