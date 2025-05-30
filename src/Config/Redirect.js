import { Navigate } from 'react-router-dom';
import paths from '~/Config/routes';

function RedirectToLogin() {
    return ( 
        <Navigate to={paths.login} replace />
    );
}

export default RedirectToLogin;