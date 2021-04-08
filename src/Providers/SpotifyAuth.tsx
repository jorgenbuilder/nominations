import { v4 as uuidv4 } from 'uuid';
import React, { createContext, useEffect, useState } from 'react';
import Spotify from 'spotify-web-api-js';

interface SpotifyTokens {
    accessToken: string;
    duration: string;
}

interface SpotifyAuthContextState {
    isSpotifyLoading: boolean;
    isSpotifyAuthed?: boolean;
    spotifyTokens?: SpotifyTokens;
    spotifyAuthError?: string;
    requestAccess?: () => void;
    handleCallback?: () => void;
}

const SpotifyAuthContext = createContext<SpotifyAuthContextState>({
    isSpotifyLoading: true,
});

const SpotifyAuthContextProvider:React.FC<{clientId: string, redirectUri: string}> = ({ children, clientId, redirectUri }) => {
    const [isLoading, setIsLoading] = useState<SpotifyAuthContextState['isSpotifyLoading']>(true);
    const [isAuthed, setIsAuthed] = useState<SpotifyAuthContextState['isSpotifyAuthed']>(false);
    const [tokens, setTokens] = useState<SpotifyAuthContextState['spotifyTokens']>();

    const scopes = [
        'user-read-private',  // Used to do search
        'playlist-modify-public',  // Used to create/modify playlists based on nomination lists
    ];

    const getLocalTokens = (): SpotifyTokens | undefined => {
        const accessToken = window.localStorage.getItem('spotifyAccessToken');
        const duration = window.localStorage.getItem('spotifyAccessTokenDuration');

        if (!accessToken || !duration) {
            return
        }

        return {
            accessToken,
            duration,
        }
    };

    const setLocalTokens = (tokens: SpotifyTokens | undefined) => {
        if (tokens) {
            window.localStorage.setItem('spotifyAccessToken', tokens.accessToken)
            window.localStorage.setItem('spotifyAccessTokenDuration', tokens.duration)
        } else {
            window.localStorage.removeItem('spotifyAccessToken')
            window.localStorage.removeItem('spotifyAccessTokenDuration')
        }
    }
    
    const testAccessToken = async (tokens: SpotifyTokens): Promise<boolean> => {
        // Some kind if API call to test access token
        const api = new Spotify();
        api.setAccessToken(tokens.accessToken);
        return await api.searchTracks('Electricityscape')
        .catch(() => false)
        .then((r) => {
            if (!r) {
                return false;
            }
            return true
        });
        
    }

    const requestAccess = () => {
        const state = uuidv4();
        window.localStorage.setItem('spotifyState', state);
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${
            clientId
        }&scope=${
            scopes.join(',')
        }&response_type=token&redirect_uri=${
            `${window.location.origin}${redirectUri}`
        }&state=${
            state
        }`;
        window.location.href = authUrl;
    }

    function handleCallback () {
        // #access_token=NwAExz...BV3O2Tk&token_type=Bearer&expires_in=3600&state=123
        const payload = window.location.hash.substring(1).split('&').reduce((agg: {[key: string]: string}, paramString: string) => {
            const [key, value]: string[] = paramString.split('=');
            agg[key] = value;
            return agg;
        }, {});

        ['access_token', 'token_type', 'expires_in', 'state'].forEach(param => {
            if (!(param in payload)) {
                throw new Error(`Spotify callback is missing param "${param}".`);
            }
        });

        if (payload.state !== window.localStorage.getItem('spotifyState')) {
            throw new Error(`Inconsistent state.`);
        }

        setLocalTokens({
            accessToken: payload.access_token,
            duration: payload.expires_in,
        });
        setTokens({
            accessToken: payload.access_token,
            duration: payload.expires_in,
        })
        setIsAuthed(true);
        setIsLoading(false);
    }

    useEffect(() => {
        const localTokens = getLocalTokens();
        if (!localTokens) {
            setIsLoading(false);
            setIsAuthed(false);
            setTokens(undefined);
            return;
        }

        testAccessToken(localTokens)
        .then((isAccessTokenActive) => {
            if (isAccessTokenActive) {
                setIsLoading(false);
                setIsAuthed(true);
                setTokens(localTokens);
                return;
            }
        });

        setIsLoading(false);
        setIsAuthed(false);
        setTokens(undefined);
    }, []);

    const value = {
        isSpotifyLoading: isLoading,
        isSpotifyAuthed: isAuthed,
        authedSpotifyUser: tokens,
        requestAccess,
        handleCallback,
        spotifyTokens: tokens,
    };
    return <SpotifyAuthContext.Provider
        value={value}
        children={children}
    />
}

export default SpotifyAuthContextProvider;

export {
    SpotifyAuthContext,
}