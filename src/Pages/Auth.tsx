import firebase from 'firebase';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import { Redirect } from 'react-router-dom';
import routes from '../routes';
import React from 'react';
import { Button } from 'react-bootstrap';

const AuthPage:React.FC = () => {
    return (
        <>
            <Button
                onClick={() => {
                const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(googleAuthProvider);
                }}
            >Sign In With Google</Button>
            {/* <button
            onClick={() => {
                firebase.auth().signOut();
            }}
            >
            Sign Out
            </button> */}
            <FirebaseAuthConsumer>
            {({ isSignedIn, user, providerId }) => {
                if (isSignedIn) {
                    return <Redirect to={routes.roundList.path} />;
                }
            }}
            </FirebaseAuthConsumer>
        </>
    );
};

export default AuthPage