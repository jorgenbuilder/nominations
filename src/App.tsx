import { firebaseConfig } from './firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import { FirebaseAuthProvider } from '@react-firebase/auth';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import routes from './routes';
import PrivateRoute from './Components/PrivateRoute';

const App:React.FC = () => {
  const Routes = Object.values(routes).map(conf => {
    return conf.private ? <PrivateRoute {...conf} key={conf.path} /> : <Route {...conf} key={conf.path} />;
  });
  return (
    <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
      <Router>
        <Switch>
          {Routes}
        </Switch>
      </Router>
    </FirebaseAuthProvider>
  )
}
  
export default App;
  