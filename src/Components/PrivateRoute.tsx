import { AuthContext } from '../Providers/Auth';
import { Redirect, Route, RouteProps } from 'react-router';
import routes from '../routes';
import { useContext } from 'react';


const PrivateRoute:React.FC<RouteProps> = (props) => {
    const { component: Component, ...rest } = props;
    const { isAuthed } = useContext(AuthContext);
    
    if (!Component) return <></>;

    return (
        <Route {...rest}
            render={
                (props) => {
                    if (isAuthed) {
                        return <Component {...props} />
                    } else {
                        return <Redirect to={{pathname: routes.auth.path, state: {from: props.location}}} />
                    }
                }
            }
        />
    );
}

export default PrivateRoute;