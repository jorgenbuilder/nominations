import { FirebaseAuthConsumer } from '@react-firebase/auth';
import { Redirect, Route, RouteProps } from 'react-router';
import routes from '../routes';


const PrivateRoute:React.FC<RouteProps> = (props) => {
    const { component: Component, ...rest } = props;
    if (!Component) return <></>;
    return (
        <FirebaseAuthConsumer>
            {({ isSignedIn }) => {
                return <Route {...rest}
                    render={
                        (props) => {
                            if (isSignedIn === true) {
                                return <Component {...props} />
                            } else {
                                return <Redirect to={{pathname: routes.auth.path, state: {from: props.location}}} />
                            }
                        }
                    }
                />
            }}
        </FirebaseAuthConsumer>
    );
}

export default PrivateRoute;