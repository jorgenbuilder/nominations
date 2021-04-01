import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import routes from './routes';
import PrivateRoute from './Components/PrivateRoute';
import Logo from './assets/logo.svg';
import { Container } from 'react-bootstrap';
import AuthProvider from './Providers/Auth';

const App:React.FC = () => {
  const Routes = Object.values(routes).map(conf => {
    return conf.private ? <PrivateRoute {...conf} key={conf.path} /> : <Route {...conf} key={conf.path} />;
  });
  return (
    <AuthProvider>
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
    </AuthProvider>
  )
}
  
export default App;
  