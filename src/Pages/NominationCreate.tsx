import firebase from 'firebase/app';
import 'firebase/firestore';
import { Breadcrumb } from 'react-bootstrap';
import { useParams } from 'react-router';
import { Redirect } from 'react-router-dom';
import { db } from '../firebase';
import NominationForm from '../Forms/Nominations';
import { Nomination, Round } from '../Models';
import { AuthContext } from '../Providers/Auth';
import LoadingPage from './Loading';
import Page from './_Base';

const NominationCreatePage:React.FC = () => {

    const { roundId } = useParams<{roundId: string}>()
    const { authedFirebaseUser: user } = useContext(AuthContext);

    const [title, setTitle] = useState<string>('');
    const [spotifyURI, setSpotifyURI] = useState<string>('');
    const [complete, setComplete] = useState<boolean>(false);
    const [round, setRound] = useState<Round>();
    const [loading, setLoading] = useState<boolean>(true);

    const handleSubmit:FormEventHandler = (e) => {
        e.preventDefault();
        if (!user) {
            throw new Error(`Can't create nomination; no user`)
        }
        const data: Nomination = {
            type: 'song',  // TODO
            data: {
                title,
                spotifyURI,
            },
            points: 0,
            user: {
                uid: user.uid,
                name: user.displayName || '???',
                avatarUrl: user.photoURL || '',
            }
        };
        db.collection('rounds').doc(roundId).collection('nomBudgets').doc(user.uid).update({
            used: firebase.firestore.FieldValue.increment(1),
            remaining: firebase.firestore.FieldValue.increment(-1),
        })
        db.collection('rounds').doc(roundId).collection('nominations').add(data)
        .then(() => setComplete(true));
    };

    const handleChange:ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        const handler = e.target?.dataset?.changeProp;
        const handlers = {
            'title': setTitle,
            'spotifyURI': setSpotifyURI,
        };
        if (!handler || !(handler in handlers)) {
            throw new Error(`
                Unrecognized/missing change handler "${handler}".
                Allowed values: ${Object.keys(handlers).join(', ')}.
            `)
        }
        handlers[handler as keyof typeof handlers](e.target.value);
    }

    useEffect(() => {
        document.title = 'New Nomination'
        db.collection('rounds').doc(roundId).get()
        .then((roundDoc) => {
            //@ts-ignore
            const roundData: Round = roundDoc.data();
            setRound(roundData);
            setLoading(false);
        })
    }, [roundId]);

    if (complete) {
        return <Redirect to={`/rounds/${roundId}/`} />
    }
    
    if (loading || !round) {
        return <LoadingPage />;
    }

    return (
        <Page>
            <Breadcrumb>
                <Breadcrumb.Item href={`/rounds/`}>Rounds</Breadcrumb.Item>
                <Breadcrumb.Item href={`/rounds/${roundId}/`}>{round.name}</Breadcrumb.Item>
                <Breadcrumb.Item>New Nomination</Breadcrumb.Item>
            </Breadcrumb>
            <h1>New Nomination</h1>
            <NominationForm
                title={title}
                spotifyURI={spotifyURI}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </Page>
    )
}

export default NominationCreatePage;