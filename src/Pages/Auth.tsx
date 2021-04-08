import firebase from 'firebase/app';
import 'firebase/auth'
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
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
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
            </div>
        </Page>
    );
};

export default AuthPage