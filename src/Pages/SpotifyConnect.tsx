import { Redirect, useLocation } from 'react-router-dom';
import routes from '../routes';
import React, { MouseEventHandler, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { SpotifyAuthContext } from '../Providers/SpotifyAuth';
import Page from './_Base';

const SpotifyConnectPage:React.FC = () => {
    const {
        isSpotifyAuthed,
        requestAccess,
    } = useContext(SpotifyAuthContext);

    const location = useLocation<{from?: string}>();
    const successUrl = location?.state?.from;

    const handleConnect:MouseEventHandler = (e) => {
        window.localStorage.setItem('successUrl', successUrl || '');
        requestAccess && requestAccess();
    }

    if (isSpotifyAuthed) {
        return <Redirect to={routes.roundList.path} />;
    }

    return (
        <Page>
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                <Button
                    onClick={handleConnect}
                    size="lg"
                >
                    Connect Spotify
                </Button>
                <p style={{ marginTop: '1em', textAlign: 'center' }}>Don't worry. We'll send you on to your destination right after:  <a href={successUrl}>{successUrl}</a></p>
            </div>
        </Page>
    );
};

export default SpotifyConnectPage