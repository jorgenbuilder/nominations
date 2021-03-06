import AuthPage from './Pages/Auth';
import SpotifyConnectPage from './Pages/SpotifyConnect';
import SpotifyConnectCallbackPage from './Pages/SpotifyConnectCallback';
import RoundDetailPage from './Pages/RoundDetail';
import RoundListPage from './Pages/RoundList';
import RoundCreatePage from './Pages/RoundCreate';
import NominationPage from './Pages/Nomination';
import NominationCreatePage from './Pages/NominationCreate';
import IndexPage from './Pages/Index';
import NotFoundPage from './Pages/404';
import RepertoirePage from './Pages/Repertoire';

interface RouteConfig {
    path: string;
    component: React.FC;
    private?: boolean;
    exact?: boolean;
};

const routes: {[key: string]: RouteConfig} = {
    index: {
        path: '/',
        component: IndexPage,
        private: false,
        exact: true,
    },
    auth: {
        path: '/auth',
        component: AuthPage,
        private: false,
    },
    spotifyConnectCallback: {
        path: '/spotify-connect/callback/',
        component: SpotifyConnectCallbackPage,
        private: false,
    },
    spotifyConnect: {
        path: '/spotify-connect',
        component: SpotifyConnectPage,
        private: false,
    },
    nominationCreate: {
        path: '/rounds/:roundId/nomination/create',
        component: NominationCreatePage,
        private: true,
    },
    nominationDetail: {
        path: '/rounds/:roundId/nomination/:nominationId',
        component: NominationPage,
        private: true,
    },
    roundCreate: {
        path: '/rounds/create',
        component: RoundCreatePage,
        private: true,
    },
    roundDetail: {
        path: '/rounds/:roundId',
        component: RoundDetailPage,
        private: true,
    },
    roundList: {
        path: '/rounds',
        component: RoundListPage,
        private: true,
    },
    repertiore: {
        path: '/repertoire',
        component: RepertoirePage,
        private: true,
    },
    notFound: {
        path: '*',
        component: NotFoundPage,
        private: false,
    },
};

export default routes;