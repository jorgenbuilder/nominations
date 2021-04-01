import firebase from 'firebase';
import { FirebaseAuthConsumer } from '@react-firebase/auth';

const AuthPage:React.FC = () => {
    return (
        <>
            <button
                onClick={() => {
                const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(googleAuthProvider);
                }}
            >Sign In With Google</button>
            <button
            onClick={() => {
                firebase.auth().signOut();
            }}
            >
            Sign Out
            </button>
            <FirebaseAuthConsumer>
            {({ isSignedIn, user, providerId }) => {
                return (
                <pre style={{ height: 300, overflow: "auto" }}>
                    {JSON.stringify({ isSignedIn, user, providerId }, null, 2)}
                </pre>
                );
            }}
            </FirebaseAuthConsumer>
        </>
    );
};

export default AuthPage