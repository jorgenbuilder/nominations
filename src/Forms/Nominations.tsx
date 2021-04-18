import { FormEventHandler, useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import SpotifySearch from '../Components/SpotifySearch';
import { parseSpotifyUri } from '../helpers';
import { SongData } from '../Models';
import { SpotifyAPIContext } from '../Providers/SpotifyAPI';

interface NominationFormProps extends SongData {
    handleSubmit: FormEventHandler;
    handleChange: (prop: string, value: string) => void;
}

const NominationForm:React.FC<NominationFormProps> = (props) => {
    const {
        handleSubmit,
        handleChange,
    } = props;

    const { SpotifyAPI } = useContext(SpotifyAPIContext);

    const [spotifyEntity, setSpotifyEntity] = useState<SpotifyApi.TrackObjectFull>();
    const [spotifyUri, setSpotifyUri] = useState<string>('');

    const handleUrl:FormEventHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const uri = parseSpotifyUri(spotifyUri);
        SpotifyAPI.getTrack(uri.split(':')[2])
        .then(r => {
            setSpotifyEntity(r)
            handleChange('title', r.name)
            handleChange('spotifyURI', r.uri)
        })
    }

    let entity, id;
    if (spotifyEntity) {
        [, entity, id] = spotifyEntity.uri.split(':');
    }

    return (
        <>
            <Form style={{marginTop: '1em'}} onSubmit={handleUrl}>
                <Form.Label>
                    Spotify URL
                </Form.Label>
                <div style={{display: 'flex'}}>
                    <Form.Control type="text" value={spotifyUri} onChange={(e) => setSpotifyUri(e.currentTarget.value)} />
                    <Button variant="success" type="submit" style={{marginLeft: '1em'}}>
                        Fetch
                    </Button>
                </div>
            </Form>
            <Form style={{marginTop: '1em'}} onSubmit={handleSubmit}>
                <Form.Label>
                    Search
                </Form.Label>
                <SpotifySearch
                    onChange={(option) => {
                        setSpotifyEntity(option[0]);
                        handleChange('title', option[0]?.name)
                        handleChange('spotifyURI', option[0]?.uri)
                    }}
                />
                {
                    spotifyEntity
                    ? <>
                        <Form.Label style={{marginTop: '1em'}}>
                            Preview
                        </Form.Label>
                        <iframe
                            title="spotify embed"
                            src={`https://open.spotify.com/embed/${entity}/${id}`}
                            width="100%"
                            height="380"
                            frameBorder="0"
                            allow="encrypted-media"
                            style={{marginBottom: '1em'}}
                        />
                    </>
                    : <></>
                }
                <Button variant="primary" type="submit" style={{marginTop: '1em'}}>
                    Create
                </Button>
            </Form>
        </>
    );
}

export default NominationForm;