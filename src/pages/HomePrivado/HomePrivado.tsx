import { Box, Grid, Typography } from '@mui/material';
import MenuComponent from '../../components/Menu';
import NewsCarousel from './components/News/NewsCarousel';
import NotificationDrawer from './components/Notifications/NotificationDrawer';
import NotificationsList from './components/Notifications/NotificationList';
import styles from './styles.module.css';
import useNews from './hooks/useNews';
import useNotifications from './hooks/useNotifications';

function HomePrivado() {
    const { ...props } = useNotifications();
    const { ...newsProps } = useNews();

    return (
        <div className={styles.body}>
            <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="stretch"
                sx={{ marginTop: '10px' }}
                columnSpacing={6}
                spacing={2}
            >
                <Grid item xs={12} lg={6}>
                    <Typography variant="h5">
                        <b>Acceso</b>
                    </Typography>
                    <MenuComponent />
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Grid
                        container
                        spacing={4}
                        sx={{
                            '& .section-container-box .carousel-container': {
                                background: '#FFFFFF',
                                marginTop: '10px',
                                borderRadius: '25px',
                                padding: '10px '
                            },
                            '& .notification-container-box': {
                                background: '#FFFFFF',
                                marginTop: '10px',
                                borderRadius: '25px',
                                padding: '10px '
                            }
                        }}
                    >
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                <b>Notificaciones</b>
                            </Typography>
                            <Box className="notification-container-box">
                                <NotificationsList {...props} />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                <b>Novedades</b>
                            </Typography>
                            <Box className="section-container-box">
                                <NewsCarousel {...newsProps} />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <NotificationDrawer {...props} />
        </div>
    );
}

export default HomePrivado;
