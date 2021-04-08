import firebase from 'firebase/app';
import 'firebase/auth'
import { Redirect, useLocation } from 'react-router-dom';
import routes from '../routes';
import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { AuthContext } from '../Providers/Auth';
import Page from './_Base';

const AuthPage:React.FC = () => {
    const {
        isAuthed,
    } = useContext(AuthContext);

    const location = useLocation<{from?: string}>();

    if (isAuthed) {
        return <Redirect to={location.state?.from || routes.roundList.path} />;
    }

    return (
        <Page>
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                <Button
                    size="lg"
                    onClick={() => {
                        const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                        firebase.auth().signInWithPopup(googleAuthProvider);
                    }}
                >
                    Sign In With Google
                </Button>
            </div>
        </Page>
    );
};

export default AuthPage