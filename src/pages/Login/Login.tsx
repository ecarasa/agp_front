import { Navigate, useParams } from 'react-router-dom';
import { Paper, Stack } from '@mui/material';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { useAppSelector } from '../../hooks/reduxHooks';
import { useIsMobile } from '../../hooks/useIsMobile';
import AGPLogo from '../../assets/image/logo-doble-color.png';
import AGPLogoIni from '../../assets/image/logo-doble-color-ini.png';
import ImageLogin from './components/ImageLogin';
import LoginForm from './components/LoginForm';
import PasswordRecovery from './components/PasswordRecovery';
import PuertoDesktop from '../../assets/image/puerto-desktop.png';
import PuertoDesktopRecovery from '../../assets/image/puerto-desktop-recovery.png';
import PuertoTablet from '../../assets/image/puerto-tablet.png';
import styles from './styles.module.css';
import UserConfirmation from './components/UserConfirmation';

export interface ViewsProp {
    [key: string]: JSX.Element;
}

const Login = () => {
    const user = useAppSelector(selectCurrentUser);
    const { isMobile, isTablet } = useIsMobile();
    const { id } = useParams();

    //un usuario logueado no debe ver la pagina de login
    if (user) {
        return <Navigate to="/agp" replace />;
    }

    const LoginViewManagement = (props: any) => {
        const views: ViewsProp = {
            login: <LoginForm {...props} />,
            'confirmar-usuario': <UserConfirmation {...props} />,
            'recuperar-clave': <PasswordRecovery {...props} />
        };
        if (id && !views[id]) return <Navigate to="/login" replace />;
        return id ? views[id] : views['login'];
    };

    return (
        <Stack direction="row" justifyContent="center" alignItems="center" minHeight="100vh">
            <Paper className={styles.paperContainer} elevation={1}>
                <Stack spacing={4} className={styles.loginFormContainer}>
                    <img
                        src={isMobile ? AGPLogoIni : AGPLogo}
                        alt="agp-banner-login"
                        className={styles.logoDoble}
                    />
                    {!isMobile && isTablet && (
                        <img
                            src={PuertoTablet}
                            alt="portada-puerto"
                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                        />
                    )}

                    <LoginViewManagement />
                </Stack>
                {!isMobile && !isTablet && (
                    <ImageLogin
                        src={id === 'recuperar-clave' ? PuertoDesktopRecovery : PuertoDesktop}
                    />
                )}
            </Paper>
        </Stack>
    );
};

export default Login;
