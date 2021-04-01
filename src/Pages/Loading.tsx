import { Spinner } from 'react-bootstrap'

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