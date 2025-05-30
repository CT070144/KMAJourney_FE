import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Fragment } from 'react';
import { publicRoutes } from './Routes/Routes';

function App() {
    const renderRoutes = (routes) => {
        return routes.map((route, index) => {
            const Layout = route.layout || Fragment;
            const Element = route.element;
            
            return (
                <Route
                    key={index}
                    path={route.path}
                    element={
                        <Layout>
                            <Element />
                        </Layout>
                    }
                >
                    {route.children && renderRoutes(route.children)}
                </Route>
            );
        });
    };

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
