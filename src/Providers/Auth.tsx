import React, { createContext, useEffect, useState } from 'react';
import { auth as FirebaseAuth } from '../firebase';

interface AuthContextState {
    isAuthLoading: boolean;
    isAuthed?: boolean | null;
    
    authedFirebaseUser?: firebase.default.User | null;
    authError?: Error;
}

const AuthContext = createContext<AuthContextState>({
    isAuthLoading: true,
});

const AuthContextProvider:React.FC = ({ children }) => {
    const [isAuthLoading, setIsAuthLoading] = useState<AuthContextState['isAuthLoading']>(true);
    const [isAuthed, setIsAuthed] = useState<AuthContextState['isAuthed']>();
    const [authedFirebaseUser, setAuthedFirebaseUser] = useState<AuthContextState['authedFirebaseUser']>();
    const [authError, setAuthError] = useState<AuthContextState['authError']>();

    useEffect(() => {
        FirebaseAuth.onAuthStateChanged(u => {
            setIsAuthLoading(true);
            setAuthError(undefined);
            setAuthedFirebaseUser(u);
            if (u !== null) {
                setIsAuthed(true);
                setIsAuthLoading(false);
            } else {
                setIsAuthed(false);
                setIsAuthLoading(false);
            }
        }, (error) => setAuthError(new Error(error.message)));
    }, []);

    const value = {
        isAuthLoading,
        isAuthed,
        authedFirebaseUser,
        authError,
    }

    return <AuthContext.Provider
        value={value}
        children={children}
    />;
}

export default AuthContextProvider;

export {
    AuthContext
}