import { CircularProgress, Divider, Grid } from '@mui/material';
import { ReactNode, useState } from 'react';
import { showAlert } from '../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useReenviarMailMutation } from '../../../services/CreateUser';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseButton from '../../../components/CloseButton';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import styles from './styles.module.css';
import UserEditDrawer from './UserEditDrawer';
import useUserAccess from '../../../hooks/useUserAccess';
import WarningIcon from '@mui/icons-material/Warning';

interface ContentProp {
    children: ReactNode;
}

interface UserProps {
    userData?: any;
    onClose?: () => any;
    cambioEstado?: any;
    refrescarDatos: any;
    setOpenCard: any;
    parametricData: any;
    loading?: boolean;
}
const UserInformation = ({
    userData,
    onClose,
    cambioEstado,
    refrescarDatos,
    setOpenCard,
    loading,
    ...props
}: UserProps) => {
    const [reenviarMail] = useReenviarMailMutation();
    const dispatch = useAppDispatch();
    const access = useUserAccess();
    const [open, setOpen] = useState<string>('');
    const handleClickEdit = (actionValue: string) => {
        setOpen(actionValue);
    };

    const SectionTitle = ({ text, actionValue, noRender }: any) => (
        <Box className={styles['section-title']}>
            <h4>{text}</h4>
            {!!access?.[6]?.[15] && !noRender && (
                <Button
                    name={`edit_${actionValue}_section_btn`}
                    variant="text"
                    onClick={() => handleClickEdit(actionValue)}
                >
                    Editar <EditIcon />
                </Button>
            )}
        </Box>
    );

    const SectionData = ({ children }: ContentProp) => (
        <div className={styles['section-data']}>{children}</div>
    );

    const openModalConfirmReenviarMail = (usuario: string, mail: string) => {
        dispatch(
            showAlert({
                message: `${mail}`,
                title: '¿Desea reenviar el mail de activación a:',
                confirmAction: reenviarmail,
                itemData: usuario,
                confirmText: 'Aceptar',
                cancelText: 'Cerrar',
                icon: 'info'
            })
        );
    };

    const reenviarmail = async (user: string) => {
        const body = {
            usuario: user
        };
        try {
            await reenviarMail(body);
            dispatch(
                showAlert({
                    title: `Mail enviado exitosamente`,
                    confirmText: 'Salir'
                })
            );
            setOpen('');
            setOpenCard(false);
            await refrescarDatos();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box className={styles['box-container']}>
            <Card variant="outlined" sx={{ height: 'inherit' }}>
                <CardContent className="right-card-information">
                    <CloseButton position="right" onClose={onClose} />
                    <SectionTitle text="Información de Usuario" actionValue="userInfo" />
                    <SectionData>
                        {loading ? (
                            <CircularProgress size="1.5em" color="inherit" />
                        ) : (
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    Nombre:&nbsp;
                                    <strong>{userData?.nombre}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    Usuario:&nbsp;
                                    <strong>{userData?.usuario}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    Documento:&nbsp;
                                    <strong>{userData?.documento || 'N/A'}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    Fecha de Nacimiento:&nbsp;
                                    <strong>
                                        {userData?.fechaNacimiento
                                            ? dayjs(userData.fechaNacimiento).format('DD/MM/YYYY')
                                            : 'N/A'}
                                    </strong>
                                </Grid>
                            </Grid>
                        )}
                    </SectionData>
                    <Divider />
                    <SectionTitle text="Contacto" actionValue="contactUserInfo" />
                    <SectionData>
                        {loading ? (
                            <CircularProgress size="1.5em" color="inherit" />
                        ) : (
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    Mail:&nbsp;
                                    <strong>{userData?.email || 'N/A'}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    Tel:&nbsp;
                                    <strong> {userData?.telefono || 'N/A'}</strong>
                                </Grid>
                            </Grid>
                        )}
                    </SectionData>
                    <Divider />
                    <SectionTitle text="Estado de Usuario" noRender />
                    <SectionData>
                        {loading ? (
                            <CircularProgress size="1.5em" color="inherit" />
                        ) : (
                            <Grid container spacing={1} className={styles['state-user-section']}>
                                <Grid item xs={6} alignItems="center" sx={{ display: 'flex' }}>
                                    {userData?.activo ? (
                                        <>
                                            <CheckCircleIcon color="success" />
                                            Activo
                                        </>
                                    ) : (
                                        <>
                                            <CancelIcon
                                                sx={{ color: '#D40000' }}
                                                fontSize="small"
                                            />
                                            Inactivo
                                        </>
                                    )}
                                </Grid>
                                <Grid item xs={6} textAlign="end">
                                    <Button
                                        name="active_user_btn"
                                        className={styles['state-user-actionbutton']}
                                        onClick={(event) => cambioEstado(event)}
                                    >
                                        {userData?.activo ? 'Desactivar' : 'Activar'}
                                    </Button>
                                </Grid>

                                <Grid item xs={6} alignItems="center" sx={{ display: 'flex' }}>
                                    {userData?.confirmado ? (
                                        <>
                                            <CheckCircleIcon color="success" />
                                            Confirmado
                                        </>
                                    ) : (
                                        <>
                                            <ErrorIcon sx={{ color: '#FAD500' }} fontSize="small" />
                                            Sin Confirmar Cuenta
                                        </>
                                    )}
                                </Grid>
                                <Grid item xs={6} textAlign="end">
                                    {!userData?.confirmado && (
                                        <Button
                                            name="block_user_btn"
                                            className={styles['state-user-actionbutton']}
                                            onClick={() =>
                                                openModalConfirmReenviarMail(
                                                    userData?.usuario,
                                                    userData?.email
                                                )
                                            }
                                        >
                                            Reenviar Email
                                        </Button>
                                    )}
                                </Grid>

                                <Grid item xs={6} alignItems="center" sx={{ display: 'flex' }}>
                                    {userData?.bloqueado ? (
                                        <>
                                            <WarningIcon
                                                sx={{ color: '#D40000' }}
                                                fontSize="small"
                                            />
                                            Bloqueado
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircleIcon color="success" />
                                            Desbloqueado
                                        </>
                                    )}
                                </Grid>
                                <Grid item xs={6} textAlign={'end'}>
                                    <Button
                                        className={styles['state-user-actionbutton']}
                                        onClick={(event) => cambioEstado(event)}
                                    >
                                        {userData?.bloqueado ? 'Desbloquear' : 'Bloquear'}
                                    </Button>
                                </Grid>
                            </Grid>
                        )}
                    </SectionData>
                    <Divider />
                    <SectionTitle text="Asignaciones" actionValue="rolesUserInfo" />
                    <SectionData>
                        {loading ? (
                            <CircularProgress size="1.5em" color="inherit" />
                        ) : (
                            <>
                                <h3>Empresa</h3>
                                <Grid container>
                                    <Grid xs={12} item>
                                        {userData?.empresa.nombre}
                                    </Grid>
                                </Grid>
                                <h3>Roles</h3>
                                <Grid container>
                                    {userData &&
                                        userData.roles?.map((items: any, index: number) => (
                                            <Grid xs={12} item key={index}>
                                                {items.nombre}
                                            </Grid>
                                        ))}
                                </Grid>
                            </>
                        )}
                    </SectionData>
                </CardContent>
            </Card>
            <UserEditDrawer
                open={open}
                setOpen={setOpen}
                userData={userData}
                refrescarDatos={refrescarDatos}
                setOpenCard={setOpenCard}
                {...props}
            />
        </Box>
    );
};

export default UserInformation;
