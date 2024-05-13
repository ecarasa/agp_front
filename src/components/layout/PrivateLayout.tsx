import React, { useEffect, useState } from 'react';
import {
    Badge,
    Box,
    CssBaseline,
    Divider,
    IconButton,
    Stack,
    Toolbar,
    Tooltip
} from '@mui/material';
import { changeTheme } from '../../features/slices/themeSlice';
import { handleErrors } from '../../utils/common';
import { logout, selectCurrentUser, setTokenFcm } from '../../features/auth/authSlice';
import { Navigate, Route, Routes } from 'react-router';
import { onMessageListener, fetchToken } from '../../firebase';
import { showAlert } from '../../features/slices/applicationSlice';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { useAppSelector } from '../../hooks/reduxHooks';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useLogoutMutation } from '../../features/auth/authApi';
import { useNavigate } from 'react-router-dom';
import { useRoles } from '../../hooks/useRoles';
import { useSubmitTokenFcmMutation } from '../../services/usersApi';
import { useTranslation } from 'react-i18next';
import AdminLayout from './RoutesManager/AdminLayout';
import AppBar from './AppBar';
import SideMenu from '../SideMenu';
import Footer from './Footer';
import logoAgpHeader from '../../assets/image/logo-agp-header-2.png';
import notificationIcon from '../../assets/image/NotificationIconHeader.png';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationDrawer from '../../pages/HomePrivado/components/Notifications/NotificationDrawer';
import NotificationsMenuBar from '../../pages/HomePrivado/components/Notifications/NotificationMenuBar';
import ScrollToTop from '../ScrollToTop';
import useNotifications from '../../pages/HomePrivado/hooks/useNotifications';
import MenuBarComponent from './MenuAppBar/MenuBarComponent';
import PasswordChangeDrawer from '../PasswordChangeDrawer/PasswordChangeDrawer';
import usePasswordChange from '../PasswordChangeDrawer/usePasswordChange';
import UserCardHeader from './UserCardHeader';
import PortCardHeader from './PortCardHeader';
import ChangePortDrawer from './ChangePort/ChangePortDrawer';
import BackdropComponent from '../Backdrop/BackdropComponent';
import useChangePort from './ChangePort/hooks/useChangePort';

type RoleProp = {
    user?: any;
};
const RenderManager = ({ user }: RoleProp) =>
    user ? <AdminLayout /> : <Navigate to="/login" replace />;

const PrivateLayout = () => {
    const { t, i18n } = useTranslation('layoutT');
    const { isMobile, isTablet } = useIsMobile();
    const { role } = useRoles();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        notifications,
        setNotifications,
        newNotification,
        setNewNotification,
        openNotificationsMenu,
        notificationsUpdated,
        setOpenNotificationsMenu,
        ...props
    } = useNotifications();
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorNotification, setAnchorNotification] = useState<null | HTMLElement>(null);
    const [checkedIdioma, setCheckedIdioma] = useState(true);
    const [checkedTema, setCheckedTema] = useState('light');
    const [open, setOpen] = useState(false);
    const appbar = document.getElementById('app-bar')?.getBoundingClientRect()!;
    const user: any = useAppSelector(selectCurrentUser);
    const { tokenFcm } = useAppSelector((state) => state?.auth);
    const [isTokenFound, setTokenFound] = useState<boolean>(false);
    const [submitTokenFcm] = useSubmitTokenFcmMutation();
    const [userLogout, { isLoading: loginOut }] = useLogoutMutation();

    const { handleOpenPortsDrawer, ports, ...changePortProps } = useChangePort({ user });

    const handleLogOut = async () => {
        const data = {
            username: user?.usuario
        };
        const response: any = await userLogout(data);
        if (response?.error) {
            handleErrors(response?.error);
        } else {
            dispatch(logout());
            navigate('/login');
        }
    };

    const { handleOpenDrawer, ...passwordChangeProps } = usePasswordChange({ handleLogOut });

    useEffect(() => {
        if (!isTokenFound) fetchToken(setTokenFound);
        if (isTokenFound && !tokenFcm) handleSubmitTokenFcm();
        // eslint-disable-next-line
    }, [isTokenFound, tokenFcm]);

    const handleSubmitTokenFcm = async () => {
        const data = { tokenFcm: isTokenFound };
        const response: any = await submitTokenFcm(data);
        if (!response?.error) dispatch(setTokenFcm(data));
    };

    onMessageListener()
        .then((payload: any) => {
            setNewNotification(true);
            // console.log('Notificacion recibida');
            // console.log(payload);
        })
        .catch((err) => console.log('failed: ', err));

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenNotificationsMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorNotification(event.currentTarget);
        setOpenNotificationsMenu(true);
    };

    const handleCloseNotificationMenu = () => {
        setOpenNotificationsMenu(false);
        setAnchorNotification(null);
    };

    const handleChangeIdioma = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (checkedIdioma === true) {
            i18n.changeLanguage('en');
        } else if (checkedIdioma === false) {
            i18n.changeLanguage('es');
        }
        setCheckedIdioma(!checkedIdioma);
    };

    const handleChangeTema = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (checkedTema === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            setCheckedTema('dark');
        } else if (checkedTema === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            setCheckedTema('light');
        }
        localStorage.setItem('theme', checkedTema);
        dispatch(changeTheme(checkedTema));
    };

    const handleDrawerToggle = () => {
        setOpen((open) => !open);
    };

    const logoutHandler = () => {
        dispatch(
            showAlert({
                title: '¿Seguro que desea cerrar sesión?',
                cancelText: 'Cancelar',
                icon: 'info',
                confirmAction: handleLogOut
            })
        );
    };

    const menuActionManager = (action: any) => {
        const { id } = action;

        if (id === 1) navigate('/agp/usuarios/perfil'); // Perfil
        if (id === 2) handleOpenDrawer(); // Cambiar contraseña
        if (id === 3) logoutHandler(); // Logout
    };

    return (
        <Box
            className="layout-desktop-container container-main"
            display="block"
            flexDirection="column"
            justifyContent="space-between"
            minHeight="100vh"
        >
            <Box minHeight="100vh">
                <ScrollToTop />
                <CssBaseline />
                <AppBar
                    position="fixed"
                    open={open}
                    isMobile={isMobile}
                    id="app-bar"
                    sx={{ overflowX: 'auto', backgroundColor: 'white' }}
                >
                    <Toolbar sx={{ paddingRight: { xs: 0, sm: 2 } }}>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{
                                mr: { sm: 1, md: 2 },
                                display: isMobile ? { sm: 'none' } : open ? 'none' : ''
                            }}
                        >
                            <MenuIcon color="primary" />
                        </IconButton>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ marginLeft: { xs: 0, sm: '3%' } }}
                            flexGrow={1}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                sx={{
                                    gap: { xs: '6px', sm: '12px' },
                                    margin: '0 3px',
                                    '& img': {
                                        height: { xs: '46px', sm: '50px', md: '56px' }
                                    },
                                    '& .MuiPaper-root': {
                                        boxShadow: 'none'
                                    },
                                    '& hr': {
                                        background: '#1D75B7',
                                        width: '2px',
                                        height: '40px',
                                        marginTop: '10px'
                                    }
                                }}
                            >
                                <Box>
                                    <img
                                        src={logoAgpHeader}
                                        alt="logoAgpHeader"
                                        style={{
                                            cursor: 'pointer',
                                            display: 'flex',
                                            padding: '8px'
                                        }}
                                        onClick={() => {
                                            open && handleDrawerToggle();
                                            navigate('/agp/home');
                                        }}
                                    />
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <PortCardHeader
                                    role={role}
                                    user={user}
                                    handleOpenPortsDrawer={handleOpenPortsDrawer}
                                    isMobile={isMobile}
                                    isTablet={isTablet}
                                    portsLength={ports?.length}
                                />
                                <Divider orientation="vertical" flexItem />
                                {/* <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{ marginLeft: '1rem' }}
                                >
                                    <Typography variant="caption">EN</Typography>
                                    <Switch
                                        checked={checkedIdioma}
                                        onChange={handleChangeIdioma}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                        color="primary"
                                    />
                                    <Typography variant="caption">ES</Typography>
                                </Stack> */}
                            </Stack>
                            <Stack
                                sx={{
                                    margin: '0 3px',
                                    '& .MuiPaper-root': {
                                        boxShadow: 'none'
                                    },
                                    '& .MuiCard-root': {
                                        marginLeft: 0
                                    }
                                }}
                                direction="row"
                                spacing={3}
                                alignItems="center"
                            >
                                <IconButton
                                    color="primary"
                                    onClick={handleOpenNotificationsMenu}
                                    sx={{
                                        '& img': {
                                            width: '40px'
                                        }
                                    }}
                                >
                                    <Badge
                                        className={`animation-badge${
                                            notificationsUpdated ? '-scaled' : ''
                                        } badge-primary`}
                                        badgeContent={notifications?.data?.totalUnread}
                                        sx={{
                                            '& .MuiBadge-anchorOriginTopRight': {
                                                fontSize: '15px',
                                                top: '5px',
                                                right: '5px'
                                            }
                                        }}
                                        color="error"
                                    >
                                        {!isTokenFound ? (
                                            <Tooltip title="Notificaciones desactivadas">
                                                <Badge
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left'
                                                    }}
                                                    badgeContent="x"
                                                    color="error"
                                                    className={
                                                        !isTokenFound
                                                            ? 'notifications-disabled'
                                                            : ''
                                                    }
                                                    invisible={isTokenFound}
                                                >
                                                    <img
                                                        src={notificationIcon}
                                                        alt="notificationIcon"
                                                    />
                                                </Badge>
                                            </Tooltip>
                                        ) : (
                                            <img src={notificationIcon} alt="notificationIcon" />
                                        )}
                                    </Badge>
                                </IconButton>

                                <UserCardHeader
                                    role={role}
                                    user={user}
                                    handleOpenNavMenu={handleOpenNavMenu}
                                    isMobile={isMobile}
                                />
                                {/* {!isMobile &&
                                    (loginOut ? (
                                        <Loading size="extrasmall" />
                                    ) : (
                                        <IconButton color="primary" onClick={logoutHandler}>
                                            <LogoutIcon />
                                        </IconButton>
                                    ))} */}
                            </Stack>
                        </Stack>
                    </Toolbar>
                </AppBar>
                <SideMenu open={open} isMobile={isMobile} handleDrawerToggle={handleDrawerToggle} />
                <Box
                    component="main"
                    sx={{
                        minHeight: '100vh'
                    }}
                >
                    <Box className="container">
                        <Routes>
                            <Route path="agp/*" element={<RenderManager user={user} />} />
                            <Route path="*" element={<RenderManager />} />
                        </Routes>
                    </Box>
                </Box>
                <Footer />
            </Box>

            <MenuBarComponent
                menuActionManager={menuActionManager}
                setAnchorElNav={setAnchorElNav}
                anchorElNav={anchorElNav}
            />

            <NotificationsMenuBar
                isMenu
                openMenu={openNotificationsMenu}
                handleClose={handleCloseNotificationMenu}
                anchorEl={anchorNotification}
                notifications={notifications}
                {...props}
            />

            <PasswordChangeDrawer {...passwordChangeProps} />

            <NotificationDrawer {...props} />

            <ChangePortDrawer
                handleOpenPortsDrawer={handleOpenPortsDrawer}
                user={user}
                isMobile={isMobile}
                ports={ports}
                {...changePortProps}
            />

            <BackdropComponent loading={loginOut} />
        </Box>
    );
};

export default PrivateLayout;
