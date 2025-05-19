import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { publicRoutes } from './Routes/Routes';


const renderRoutes = (routes) => {
    return routes.map((route, index) => {
        if (route.children) {
            return (
                <Route key={index} path={route.path} element={route.element}>
                    {renderRoutes(route.children)}
                </Route>
            );
        }
        return <Route key={index} path={route.path} element={route.element} />;
    });
};

function App() {
    return (
        <Router>
            <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Routes>
                {renderRoutes(publicRoutes)}
            </Routes>
        </Router>
    );
}

export default App;
