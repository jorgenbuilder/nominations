import { FormEventHandler, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Redirect } from 'react-router';
import { db } from '../firebase';
import { Round, NomSchema } from '../Models';

const RoundCreatePage:React.FC = () => {

    const [name, setName] = useState<Round['name']>('');
    const [type, setType] = useState<NomSchema['type']>('song');
    const [count, setCount] = useState<NomSchema['count']>(0);
    const [votingRules, setVotingRules] = useState<string>('{"3": 1, "2": 2, "1": 2}');
    const [complete, setComplete] = useState<boolean>(false);

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
        console.log(data)
        db.collection('rounds').add(data)
        .then(() => setComplete(true))
    };

    if (complete) {
        return <Redirect to={'/rounds'} />
    }

    return (
        <>
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
        </>
    )
}

export default RoundCreatePage;