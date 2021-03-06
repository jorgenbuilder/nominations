import {
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';
import routes from './routes';
import Logo from './assets/logo.png';
import { Container } from 'react-bootstrap';
import React, { useContext } from 'react';
import { AuthContext } from './Providers/Auth';
import LoadingPage from './Pages/Loading';
import { SpotifyAuthContext } from './Providers/SpotifyAuth';
import AccountDropdown from './Components/AccountDropdown';

const App:React.FC = () => {
  const location = useLocation();
  const destination = location.pathname;

  const {
    isAuthLoading,
    isAuthed,
  } = useContext(AuthContext);

  const {
    isSpotifyLoading,
    isSpotifyAuthed,
  } = useContext(SpotifyAuthContext)

  let redirect;
  if (![routes.auth.path, routes.spotifyConnect.path, routes.spotifyConnectCallback.path].includes(destination)) {
    if (!isAuthed) {
      redirect = routes.auth.path;
    } else if (!isSpotifyAuthed ) {
      redirect = routes.spotifyConnect.path; 
    }
  }

  const Routes = Object.values(routes).map(conf => <Route {...conf} key={conf.path} />);

  if (isAuthLoading || isSpotifyLoading) {
    return <LoadingPage />;
  }

  return (
      <Container style={{maxWidth: '600px', marginBottom: '2em'}}>
        <AccountDropdown />
        <div>
          <img alt="Logo" style={{margin: '2em auto', display: 'block', maxWidth: '140px', }} src={Logo} />
        </div>
        <Switch>
          {Routes}
        </Switch>
        {redirect
          ? <Redirect to={{pathname: redirect, state: { from: destination}}} />
          : ''}
      </Container>
  )
}
  
export default App;
  