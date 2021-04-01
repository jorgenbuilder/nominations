import { Container, Spinner } from 'react-bootstrap'
import Logo from '../assets/logo.svg';

const LoadingPage:React.FC = () => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0, right: 0, bottom: 0, left: 0,
        }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );
}

export default LoadingPage;