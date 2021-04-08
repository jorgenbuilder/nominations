import { FormEventHandler, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import SpotifySearch from '../Components/SpotifySearch';
import { SongData } from '../Models';

interface NominationFormProps extends SongData {
    handleSubmit: FormEventHandler;
    handleChange: (prop: string, value: string) => void;
}

const NominationForm:React.FC<NominationFormProps> = (props) => {
    const {
        handleSubmit,
        handleChange,
    } = props;

    const [spotifyEntity, setSpotifyEntity] = useState<SpotifyApi.TrackObjectFull | SpotifyApi.AlbumObjectSimplified>();
    let entity, id;
    if (spotifyEntity) {
        [, entity, id] = spotifyEntity.uri.split(':');
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Label>
                    Search
                </Form.Label>
                <SpotifySearch
                    searchType="song"
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