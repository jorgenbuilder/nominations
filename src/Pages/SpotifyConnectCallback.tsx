import { Redirect } from 'react-router-dom';
import routes from '../routes';
import React, { useContext } from 'react';
import { SpotifyAuthContext } from '../Providers/SpotifyAuth';
import LoadingPage from './Loading';

const SpotifyConnectPage:React.FC = () => {
    const {
        handleCallback
    } = useContext(SpotifyAuthContext);

    const successUrl = window.localStorage.getItem('successUrl') || routes.roundList.path;

    if (!handleCallback) {
        return <LoadingPage />
    }
    
    handleCallback();

    return <Redirect to={successUrl} />;
};

export default SpotifyConnectPage