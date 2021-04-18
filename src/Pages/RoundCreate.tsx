import React, { FormEventHandler, useEffect, useState } from 'react';
import { Breadcrumb, Button, Form } from 'react-bootstrap';
import { Redirect } from 'react-router';
import { db } from '../Services/Firestore';
import { Round, NomSchema } from '../Models';
import Page from './_Base';

const RoundCreatePage:React.FC = () => {

    const [name, setName] = useState<Round['name']>('');
    const [type, setType] = useState<NomSchema['type']>('song');
    const [count, setCount] = useState<NomSchema['count']>(0);
    const [votingRules, setVotingRules] = useState<string>('{"3": 1, "2": 2, "1": 2}');
    const [complete, setComplete] = useState<string>();

    const handleSubmit:FormEventHandler = (e) => {
        e.preventDefault();
        const data: Round = {
            name,
            status: 'live',
            nomSchema: {
                type,
                count,
            },
            votSchema: JSON.parse(votingRules)
        };
        db.rounds.add(data)
        .then((round) => setComplete(round.id))
    };

    useEffect(() => {
        document.title = 'New Round'
    }, [])

    if (complete) {
        return <Redirect to={`/rounds/${complete}`} />
    }

    return (
        <Page>
            <Breadcrumb>
                <Breadcrumb.Item href={`/rounds/`}>Rounds</Breadcrumb.Item>
                <Breadcrumb.Item>New Round</Breadcrumb.Item>
            </Breadcrumb>
            <h1>Create A Round</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Label>
                    Round Name
                </Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.currentTarget.value)} />
                <Form.Label>
                    Nomination Type
                </Form.Label>
                <Form.Control as="select" value={type} onChange={(e) => {
                    //@ts-ignore
                    setType(e.currentTarget.value)
                }}>
                    <option value="song">Song</option>
                    <option value="album">Album</option>
                </Form.Control>
                <Form.Label>
                    Nominations Per Persons
                </Form.Label>
                <Form.Control type="number" value={count} onChange={(e) => setCount(parseInt(e.currentTarget.value))} />
                <Form.Label>
                    Voting Rules
                </Form.Label>
                <Form.Control style={{marginBottom: '1em'}} value={votingRules} onChange={(e) => setVotingRules(e.currentTarget.value)} as="textarea" rows={3} />
                <Button variant="primary" type="submit">
                    Create
                </Button>
            </Form>
        </Page>
    )
}

export default RoundCreatePage;