import firebase from 'firebase/app';
import 'firebase/firestore';
import { useEffect, useState, useContext } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import SpotifySearch from '../Components/SpotifySearch';
import { Repertoire } from '../Models';
import { SpotifyAPIContext } from '../Providers/SpotifyAPI';
import db, { getOrCreateRepertoire } from '../Services/Firestore';
import LoadingPage from './Loading';
import Page from './_Base';

const RepertoirePage:React.FC = () => {

    const [repertoire, setRepertoire] = useState<firebase.firestore.DocumentSnapshot<Repertoire>>()
    const [tracks, setTracks] = useState<firebase.firestore.DocumentSnapshot<SpotifyApi.TrackObjectFull>[]>();
    const [tracksData, setTracksData] = useState<SpotifyApi.TrackObjectFull[]>();
    const [selection, setSelection] = useState<SpotifyApi.TrackObjectFull>();
    const [randomTrack, setRandomTrack] = useState<SpotifyApi.TrackObjectFull>();
    const [randomTrackFeatures, setRandomTrackFeatures] = useState<SpotifyApi.AudioFeaturesResponse>();

    const { SpotifyAPI } = useContext(SpotifyAPIContext);

    const handleAdd = async () => {
        if (!tracks || !tracksData || !repertoire || !selection) return;
        if (tracksData.includes(selection)) {
            alert(`We've already got that one.`)
            return;
        }
        const change = tracksData ? [...tracksData, selection] : [tracksData];
        setTracksData(change);
        await db.repertoireTracks(repertoire.id).add(selection);
        db.repertoireTracks(repertoire.id).get()
        .then(tracks => {
            setTracks(tracks.docs);
            setTracksData(tracks.docs.map(track => track.data()));
        });
    }

    const handleRemove = (track: firebase.firestore.DocumentSnapshot<SpotifyApi.TrackObjectFull>) => {
        if (!tracks || !tracksData || !repertoire) return
        let change = [...tracksData]
        change.splice(tracks.indexOf(track), 1);
        setTracksData(change);
        console.log(tracks.indexOf(track), change)
        db.repertoireTracks(repertoire.id).doc(track.id).delete();
    }

    const randomSong = () => {
        if (!tracksData) return;
        const i = Math.floor(Math.random() * tracksData.length);
        const track = tracksData[i];
        setRandomTrack(track);
        SpotifyAPI.getAudioFeaturesForTrack(track.id)
        .then(setRandomTrackFeatures);
    }
    
    useEffect(() => {
        getOrCreateRepertoire().then((repertoireDoc) => {
            setRepertoire(repertoireDoc);
            db.repertoireTracks(repertoireDoc.id).get()
            .then(tracks => {
                setTracks(tracks.docs);
                setTracksData(tracks.docs.map(track => track.data()));
            });
        })
    }, []);

    if (!repertoire || !tracks) {
        return <LoadingPage />
    }

    return (
        <Page>
            <h1>Repertoire</h1>
            <ListGroup>
                {tracks.map((track, i) => {
                    const t = track.data();
                    return <ListGroup.Item key={`rep-${i}`}>
                        {t?.name}, <i>{t?.artists[0].name}</i> ({t?.album.name})
                        <a href="#delete" style={{marginLeft: '1em'}} onClick={() => handleRemove(track)}>Delete</a>
                    </ListGroup.Item>
                })}
            </ListGroup>
            <h2>Add a Track</h2>
            <SpotifySearch onChange={([track]) => setSelection(track)} />
            <Button onClick={handleAdd}>Add</Button>
            <h2>Random Song</h2>
            <Button onClick={() => randomSong()}>Randomize</Button>
            <dl>
                {randomTrack
                    ? <>
                        <dt>Track</dt>
                        <dd>{randomTrack.name}</dd>
                        <dt>Artist</dt>
                        <dd>{randomTrack?.artists[0].name}</dd>
                    </>
                    : ''
                }
                {randomTrackFeatures
                    ? <>
                        <dt>Lyrics</dt>
                        <dd><a href={`https://genius.com/search?q=${encodeURIComponent(`${randomTrack?.name || ''}, ${randomTrack?.artists[0].name || ''}`)}`}>Genius</a></dd>
                        <dt>Key</dt>
                        <dd>{['C', 'D flat', 'D', 'E flat', 'E', 'F', 'G flat', 'G', 'A flat', 'A', 'B flat', 'B', 'C flat'][randomTrackFeatures.key]}</dd>
                        <dt>Tempo</dt>
                        <dd>{Math.floor(randomTrackFeatures.tempo)}BPM</dd>
                        <dt>Time Signature</dt>
                        <dd>{randomTrackFeatures.time_signature}</dd>
                        <dt>Energy</dt>
                        <dd>{randomTrackFeatures.energy}</dd>
                        <dt>Danceability</dt>
                        <dd>{randomTrackFeatures.danceability}</dd>
                    </>
                    : ''}
            </dl>
        </Page>
    );
}

export default RepertoirePage
