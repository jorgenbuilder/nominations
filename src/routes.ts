import AuthPage from './Pages/Auth';

interface RouteConfig {
    path: string;
    component: React.FC;
};

const routes: RouteConfig[] = [
    {
        path: '/auth',
        component: AuthPage,
    },
];

export default routes;