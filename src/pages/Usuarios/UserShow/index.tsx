import { Box, Divider, Grid, Paper } from '@mui/material';
import { selectCurrentUser } from '../../../features/auth/authSlice';
import { useAppSelector } from '../../../hooks/reduxHooks';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import dayjs from 'dayjs';
import EmailIcon from '@mui/icons-material/Email';
import ErrorIcon from '@mui/icons-material/Error';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
import SectionHeader from '../../../components/SectionHeader';
import WarningIcon from '@mui/icons-material/Warning';

const defaultColor = '#1D75B7';

function UserShow() {
    const user: any = useAppSelector(selectCurrentUser);

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>Información de Usuario</SectionHeader.Title>
            </SectionHeader>
            <Box display="flex" justifyContent="center">
                <Paper
                    sx={{
                        border: '1px solid #D9D9D9',
                        borderRadius: '12px',
                        width: { xs: '95%', sm: '75%', lg: '65%' },
                        height: 'auto',
                        padding: '16px',
                        '& span': {
                            fontWeight: 800,
                            fontSize: '15px'
                        },
                        '& h3': {
                            marginLeft: '5px'
                        }
                    }}
                >
                    <Grid container spacing={2} ml={1} mb={1}>
                        <Grid item xs={12} display="flex" alignItems="center">
                            <PersonIcon fontSize="medium" sx={{ color: defaultColor }} />
                            <h3>Datos Personales</h3>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            Nombre: <span>{user?.nombre}</span>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            Usuario: <span>{user?.usuario}</span>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            Documento: <span>{user?.documento || 'N/A'}</span>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            Fecha de Nacimiento:{' '}
                            <span>
                                {user?.fechaNacimiento
                                    ? dayjs(user?.fechaNacimiento).format('DD/MM/YYYY')
                                    : 'N/A'}
                            </span>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid container spacing={2} ml={1} mb={1}>
                        <Grid item xs={12} display="flex" alignItems="center">
                            <EmailIcon fontSize="medium" sx={{ color: defaultColor }} />
                            <h3>Datos de Contacto</h3>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            Email: <span>{user?.email || 'N/A'}</span>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            Telefono: <span>{user?.telefono || 'N/A'}</span>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid
                        container
                        spacing={2}
                        ml={1}
                        mb={1}
                        sx={{
                            '& .MuiGrid-item': {
                                alignItems: 'center',
                                display: 'flex',
                                '& span': {
                                    marginLeft: '5px'
                                }
                            }
                        }}
                    >
                        <Grid item xs={12} display="flex" alignItems="center">
                            <AdminPanelSettingsIcon
                                fontSize="medium"
                                sx={{ color: defaultColor }}
                            />
                            <h3>Estado de Usuario</h3>
                        </Grid>
                        <Grid item xs={12}>
                            {user?.activo ? (
                                <>
                                    <CheckCircleIcon color="success" />
                                    <span>Activo</span>
                                </>
                            ) : (
                                <>
                                    <CancelIcon sx={{ color: '#D40000' }} />
                                    <span>Inactivo</span>
                                </>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            {user?.confirmado ? (
                                <>
                                    <CheckCircleIcon color="success" />
                                    <span>Confirmado</span>
                                </>
                            ) : (
                                <>
                                    <ErrorIcon sx={{ color: '#FAD500' }} />
                                    <span>Sin Confirmar Cuenta</span>
                                </>
                            )}
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid container spacing={2} ml={1}>
                        <Grid item xs={12} display="flex" alignItems="center">
                            <ManageAccountsIcon fontSize="medium" sx={{ color: defaultColor }} />
                            <h3>Asignaciones</h3>
                        </Grid>
                        <Grid item xs={6} sm={5}>
                            Empresa:
                        </Grid>
                        <Grid item xs={6} sm={7}>
                            <span>{user?.empresa?.nombre}</span>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            Rol(es):
                        </Grid>
                        <Grid item xs={12} md={7} display="flex" flexDirection="column">
                            {user?.roles?.map((i: any) => (
                                <span>{i.nombre}</span>
                            ))}
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </>
    );
}

export default UserShow;
