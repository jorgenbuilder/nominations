import { createContext, useContext, useState } from 'react';
import Spotify from 'spotify-web-api-js';
import { SpotifyAuthContext } from './SpotifyAuth';

// Feels like this should be in Services.
// Because it isn't really providing any state.
// All this needs to do is initialize the API wrapper.

interface SpotifyAPIProviderState {
    SpotifyAPI: Spotify.SpotifyWebApiJs;
};

const SpotifyAPIContext = createContext<SpotifyAPIProviderState>({
    SpotifyAPI: new Spotify(),
});

const SpotifyAPIProvider:React.FC = ({ children }) => {

    const { spotifyTokens } = useContext(SpotifyAuthContext);
    const [spotifyAPI] = useState<SpotifyAPIProviderState['SpotifyAPI']>(new Spotify())

    if (spotifyTokens) {
        spotifyAPI.setAccessToken(spotifyTokens.accessToken);
    }

    const value = {
        SpotifyAPI: spotifyAPI,
    };

    return (
        <SpotifyAPIContext.Provider
            children={children}
            value={value}
        />
    );
}

export default SpotifyAPIProvider;

export {
    SpotifyAPIContext,
}