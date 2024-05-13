import { Box, Divider, List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { Fragment } from 'react';
import { getDateTime } from '../../../../utils/common';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/button/Button';
import Loading from '../../../../components/Loading';
import NotificationIcons from './NotificationIcons';
import styles from './styles.module.css';

function NotificationsList({
    isMenu,
    closeMenu,
    notifications,
    fetchingNotifications,
    loadingNotifications,
    handleOpenDrawer,
    ...props
}: any) {
    const { isMobile, isTablet } = useIsMobile();
    const navigate = useNavigate();
    const data = notifications?.data?.data || [];

    return (
        <>
            <List
                className={styles['list-root']}
                sx={{
                    height: 'auto',
                    maxHeight: '305px',
                    borderRadius: isMenu ? 0 : '25px',
                    '& .MuiListItemText-primary': {
                        color: '#262626',
                        fontWeight: 800,
                        '& div span:first-of-type': {
                            fontSize: '15px',
                            overflow: 'hidden',
                            whiteSpace: isMobile || isTablet || !isMenu ? 'break-spaces' : 'nowrap',
                            maxWidth: isMenu ? '400px' : '460px',
                            minWidth: isMobile ? 'none' : '230px',
                            marginRight: '15px',
                            alignItems: 'center',
                            display: 'flex',
                            lineHeight: isMobile ? '18px' : 'inherit'
                        },
                        '& div span:last-of-type': {
                            fontSize: '14px',
                            minWidth: '120px'
                        }
                    },
                    '& .MuiListItemText-root': {
                        margin: '6px '
                    },
                    '& .MuiListItemAvatar-root': {
                        display: 'flex',
                        justifyContent: 'center',
                        minWidth: '40px',
                        alignItems: 'center',
                        '& .MuiSvgIcon-root': {
                            fontSize: '30px'
                        }
                    }
                }}
            >
                {(!isMenu && loadingNotifications) || (isMenu && fetchingNotifications) ? (
                    <Loading size="small" />
                ) : (
                    data?.map((item: any) => (
                        <Fragment key={item?.id}>
                            <ListItemButton
                                sx={{
                                    padding: '8px',
                                    backgroundColor: !item?.fechaLectura
                                        ? '#e9e9eb'
                                        : 'transparent',
                                    height:
                                        isMobile && isMenu
                                            ? 'auto'
                                            : !isMobile && isMenu
                                            ? '60px'
                                            : '75px'
                                }}
                                onClick={() => {
                                    if (closeMenu) closeMenu();
                                    handleOpenDrawer(item);
                                }}
                            >
                                <ListItemAvatar>
                                    <NotificationIcons group={item?.agrupador?.id} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <div className={styles['list-primary-text']}>
                                            <span>{item?.titulo || ''}</span>
                                            <span>{getDateTime(item.fechaAlta)}</span>
                                        </div>
                                    }
                                />
                            </ListItemButton>
                            <Divider />
                        </Fragment>
                    ))
                )}
            </List>

            {!isMenu && !!data?.length && (
                <Box className="flex-center">
                    <Button type="text" onClick={() => navigate('/agp/notificaciones')}>
                        Ver Más
                    </Button>
                </Box>
            )}

            {!loadingNotifications && !fetchingNotifications && !data?.length && (
                <Box
                    className={styles['flex-center-mt']}
                    sx={{ minWidth: '300px', '& p': { marginLeft: '35px' } }}
                >
                    <p>Sin notificaciones.</p>
                </Box>
            )}
        </>
    );
}

export default NotificationsList;
