import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthProvider from './Providers/Auth';
import SpotifyAuthProvider from './Providers/SpotifyAuth';
import SpotifyAPIProvider from './Providers/SpotifyAPI';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, } from 'react-router-dom';

if (['alaja-c3481.web.app', 'alaja-c3481.firebaseapp.com'].includes(window.location.host)) {
  window.location.href = `https://nominations.ally.audio/${window.location.pathname}`;
}

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <SpotifyAuthProvider clientId="721aac2d9642429a8457bc322b1c8efd" redirectUri="/spotify-connect/callback/">
        <SpotifyAPIProvider>
          <AnimatePresence exitBeforeEnter>
            <Router>
              <App />
            </Router>
          </AnimatePresence>
        </SpotifyAPIProvider>
      </SpotifyAuthProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
