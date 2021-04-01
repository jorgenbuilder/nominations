import AuthPage from './Pages/Auth';
import RoundDetailPage from './Pages/RoundDetail';
import RoundListPage from './Pages/RoundList';
import RoundCreatePage from './Pages/RoundCreate';
import NominationPage from './Pages/Nomination';
import NominationCreatePage from './Pages/NominationCreate';
import IndexPage from './Pages/Index';

interface RouteConfig {
    path: string;
    component: React.FC;
};

const routes: {[key: string]: RouteConfig} = {
    auth: {
        path: '/auth',
        component: AuthPage,
    },
    roundList: {
        path: '/rounds',
        component: RoundListPage,
    },
    roundCreate: {
        path: '/rounds/create',
        component: RoundCreatePage,
    },
    roundDetail: {
        path: '/rounds/:roundId',
        component: RoundDetailPage,
    },
    nominationDetail: {
        path: '/nomination/:nominationId',
        component: NominationPage,
    },
    nominationCreate: {
        path: '/nomination/create',
        component: NominationCreatePage,
    },
    index: {
        path: '/',
        component: IndexPage,
    },
};

export default routes;