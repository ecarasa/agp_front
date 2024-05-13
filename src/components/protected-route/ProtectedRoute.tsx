import { ReactNode } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { useAppSelector } from '../../hooks/reduxHooks';

type ProtectedRouteProps = {
    rol: string;
    redirectPath?: string;
    children?: ReactNode;
};

const ProtectedRoute = ({ rol, redirectPath = '/login', children }: ProtectedRouteProps) => {
    const user = useAppSelector(selectCurrentUser);

    if (!user) return <Navigate to={redirectPath} replace />;

    return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
