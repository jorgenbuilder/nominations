import { useCallback, useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { SpotifyAPIContext } from '../Providers/SpotifyAPI';
import db from '../Services/Firestore';

const SpotifyPlaylist:React.FC = () => {

    const { roundId } = useParams<{roundId: string, nominationId: string}>();

    const { SpotifyAPI } = useContext(SpotifyAPIContext);

    const [playlist, setPlaylist] = useState<SpotifyApi.PlaylistObjectFull> ();

    const setTracks = useCallback(async (playlistId: string) => {
        const nominationDocs = await db.nominations(roundId).orderBy('points', 'desc').get();
        const tracks = nominationDocs.docs.reduce((agg: string[], nom) => {
            // https://open.spotify.com/track/39rHfrVqCX6A55GF7uOZSC?si=kljCwg7NQbe0JKcQFTXF0A
            let uri = nom.data().data.spotifyURI
            if (uri.includes('http')) {
                uri = uri.split('track/')[1];
                uri = uri.split('?')[0];
                uri = `spotify:track:${uri}`
            }
            agg.push(uri);
            return agg;
        }, [] as string[])

        await SpotifyAPI.replaceTracksInPlaylist(playlistId, tracks);
    }, [SpotifyAPI, roundId]);

    const getOrCreatePlaylist = useCallback(async () => {
        const roundsRef = db.rounds.doc(roundId);
        const roundDoc = await roundsRef.get();
        const roundData = roundDoc.data();

        if (!roundData) {
            throw new Error(`Can't make playlist. No round.`)
        }

        if (roundData.playlist) {
            setPlaylist(roundData.playlist);
            return roundData.playlist.id;
        }

        const { id } = await SpotifyAPI.getMe();
        const createdPlaylist = await SpotifyAPI.createPlaylist(id, {
            name: `Nominations ${roundData?.name}`,
        });
        roundsRef.set({
            playlist: createdPlaylist,
        }, { merge: true })
        setPlaylist(createdPlaylist);
        return createdPlaylist?.id;
    }, [SpotifyAPI, roundId])

    useEffect(() => {
        getOrCreatePlaylist()
        .then(setTracks);
    }, [getOrCreatePlaylist, setTracks]);

    return (
        <Button variant="success" href={playlist?.external_urls.spotify} target="_blank">
            Open in Spotify
        </Button>
    )
}

export default SpotifyPlaylist;