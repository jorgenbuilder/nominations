import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDKLJOl6oBoC9RcczYp7M097Cxot7ubE2U",
    authDomain: "alaja-c3481.firebaseapp.com",
    projectId: "alaja-c3481",
    storageBucket: "alaja-c3481.appspot.com",
    messagingSenderId: "396042941487",
    appId: "1:396042941487:web:7441a0b6a7efcbc48a02da",
    measurementId: "G-QGMEH58DHY",
    databaseURL: ""
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseApp.auth();

export {
    firebaseConfig,
    auth,
};
