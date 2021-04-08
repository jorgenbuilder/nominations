import firebase from 'firebase/app';
import 'firebase/auth'
import styled from 'styled-components';
import { useContext } from 'react';
import { AuthContext } from '../Providers/Auth';
import { Dropdown } from 'react-bootstrap';

const Element = styled.div`
position: absolute;
top: 1em; right: 1em;
`;

const AccountDropdown:React.FC = () => {
    const { authedFirebaseUser: user } = useContext(AuthContext);

    if (!user) return <></>

    return (
        <Element>
            <Dropdown>
                <Dropdown.Toggle>
                    Account
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => firebase.auth().signOut()}>Sign Out</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Element>
    )
}

export default AccountDropdown;