import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import routes from '../routes';
import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { AuthContext } from '../Providers/Auth';
import Page from './_Base';

const AuthPage:React.FC = () => {
    const {
        isAuthed,
    } = useContext(AuthContext);

    if (isAuthed) {
        return <Redirect to={routes.roundList.path} />;
    }

    return (
        <Page>
            <Button
                onClick={() => {
                    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                    firebase.auth().signInWithPopup(googleAuthProvider);
                }}
            >
                Sign In With Google
            </Button>
            {/* <button
            onClick={() => {
                firebase.auth().signOut();
            }}
            >
            Sign Out
            </button> */}
        </Page>
    );
};

export default AuthPage