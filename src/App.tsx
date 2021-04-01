import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import routes from './routes';
import Logo from './assets/logo.svg';
import { Container } from 'react-bootstrap';
import React, { useContext } from 'react';
import { AuthContext } from './Providers/Auth';
import LoadingPage from './Pages/Loading';

const App:React.FC = () => {
  const Routes = Object.values(routes).map(conf => <Route {...conf} key={conf.path} />);
  const {
    isAuthLoading,
    isAuthed,
  } = useContext(AuthContext);

  if (isAuthLoading) {
    return <LoadingPage />;
  }

  if (!isAuthed) {
    return <Redirect to={{pathname: routes.auth.path}} />
  }

  return (
      <Container style={{maxWidth: '600px', marginBottom: '2em'}}>
        <div>
          <img alt="Logo" style={{margin: '2em auto', display: 'block'}} src={Logo} />
        </div>
        <Router>
          <Switch>
            {Routes}
          </Switch>
        </Router>
      </Container>
  )
}
  
export default App;
  