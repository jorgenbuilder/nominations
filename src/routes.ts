import AuthPage from './Pages/Auth';
import RoundDetailPage from './Pages/RoundDetail';
import RoundListPage from './Pages/RoundList';
import RoundCreatePage from './Pages/RoundCreate';
import NominationPage from './Pages/Nomination';
import NominationCreatePage from './Pages/NominationCreate';
import IndexPage from './Pages/Index';
import NotFoundPage from './Pages/404';

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
    roundList: {
        path: '/rounds',
        component: RoundListPage,
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
    nominationDetail: {
        path: '/nomination/:nominationId',
        component: NominationPage,
        private: true,
    },
    nominationCreate: {
        path: '/nomination/create',
        component: NominationCreatePage,
        private: true,
    },
    notFound: {
        path: '*',
        component: NotFoundPage,
        private: false,
    },
};

export default routes;