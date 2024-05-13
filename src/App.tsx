import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Alert from './components/Alert/AlertDialog';
import Login from './pages/Login';
import PrivateLayout from './components/layout/PrivateLayout';
import ProtectedRoute from './components/protected-route/ProtectedRoute';

const App = () => {
    const theme = localStorage.getItem('theme');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }, [theme]);

    return (
        <>
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="login/:id" element={<Login />} />
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute rol="viewer">
                            <PrivateLayout />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<p>There's nothing here: 404!</p>} />{' '}
                {/* <Route path="*" element={<Navigate replace to="/" />} /> */}
            </Routes>
            <Alert />
        </>
    );
};

export default App;
