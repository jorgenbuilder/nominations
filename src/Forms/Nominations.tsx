import { FormEventHandler } from 'react';
import { Button, Form } from 'react-bootstrap';
import { SongData } from '../Models';

interface NominationFormProps extends SongData {
    handleSubmit: FormEventHandler;
    handleChange: FormEventHandler;
}

const NominationForm:React.FC<NominationFormProps> = (props) => {
    const {
        handleSubmit,
        handleChange,
        title,
        spotifyURI,
    } = props;
    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Label>
                    Title
                </Form.Label>
                <Form.Control value={title} onChange={handleChange.bind('title')} type="text" />
                <Form.Label>
                    Spotify URL
                </Form.Label>
                <Form.Control style={{marginBottom: '1em'}} value={spotifyURI} onChange={handleChange.bind('spotifyURI')} type="text" />
                <Button variant="primary" type="submit">
                    Create
                </Button>
            </Form>
        </>
    );
}

export default NominationForm;