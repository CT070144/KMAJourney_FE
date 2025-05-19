import Auth from '~/Pages/Auth';
import Score from '~/Pages/KMAScore';
import {VerifyForm, LoginForm, RegisterForm, ResetPasswordForm}  from '~/components/Form';
import paths from '~/Config/routes';
import { Navigate } from 'react-router-dom';

export const publicRoutes = [
    {
        path: paths.default,
        element: <Navigate to="/auth/login" replace />,
    },
    {
        path: paths.auth,
        element: <Auth />,
        children: [
            {
                path: 'login',
                element: <LoginForm />
            },
            {
                path: 'register',
                element: <RegisterForm />
            },
            {
                path: 'verify',
                element: <VerifyForm />
            },
            {
                path: 'reset-password',
                element: <ResetPasswordForm />
            }
        ]
    },
    {
        path: paths.score,
        element: <Score />,
    }
   
];

export const privateRoutes = [];
