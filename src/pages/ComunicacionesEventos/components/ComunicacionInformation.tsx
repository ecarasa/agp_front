import { FC, ReactNode } from 'react';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CloseButton from '../../../components/CloseButton';
import styles from './styles.module.css';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ButtonActions from '../../../components/ButtonActions';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SectionHeader from '../../../components/SectionHeader';
import { ComunicacionesEvento } from '../ComunicacionesEventosIndex';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { setCommunicationData } from '../../../features/slices/applicationSlice';

interface ContentProp {
    children: ReactNode;
}

interface ComCertificadosProps {
    communicationData?: ComunicacionesEvento | null;
    onClose?: () => any;
    cambioEstado?: any;
    refrescarDatos: any;
    setAbrirCard: any;
}
const ComunicacionInformation: FC<ComCertificadosProps> = ({ communicationData, onClose }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const SectionData = ({ children }: ContentProp) => (
        <div className={styles['section-data']}>{children}</div>
    );
    const SectionTitle = ({ text, actionValue, noRender }: any) => (
        <Box className={styles['section-title']} sx={{ pt: 2 }}>
            <h4>{text}</h4>
        </Box>
    );

    return (
        <Box className={styles['box-container']}>
            <Card variant="outlined" sx={{ height: 'inherit', borderRadius: '12px' }}>
                <CardContent sx={{ overflow: 'auto' }}>
                    <CloseButton position="right" onClose={onClose} />
                    <SectionHeader.DrawerTitle>
                        Previsualización de Mensaje
                    </SectionHeader.DrawerTitle>
                    <Box
                        sx={{
                            textAlign: 'center',
                            justifyItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            mt: 6,
                            mb: 6
                        }}
                    >
                        <Box>
                            <EventAvailableIcon sx={{ color: '#000', fontSize: 38 }} />
                            <Box>
                                <strong>{communicationData?.titulo}</strong>
                            </Box>
                            <Box sx={{ color: '#000', fontSize: 14, pt: 2 }}>
                                {communicationData?.mensajeCorto}|
                            </Box>
                        </Box>
                    </Box>
                    <SectionData>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        width: '100%'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexBasis: '100%',
                                            flex: 1
                                        }}
                                    >
                                        <Box>Estado:</Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexBasis: '100%',
                                            flex: 1
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                width: '50%'
                                            }}
                                        >
                                            {communicationData?.activo ? (
                                                <CheckCircleIcon
                                                    sx={{ color: '#6EBE64' }}
                                                    fontSize="small"
                                                />
                                            ) : (
                                                <WarningIcon
                                                    sx={{ color: '#D40000' }}
                                                    fontSize="small"
                                                />
                                            )}

                                            <strong>
                                                {communicationData?.activo ? 'Activo' : 'Inactivo'}
                                            </strong>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        width: '100%'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexBasis: '100%',
                                            flex: 1
                                        }}
                                    >
                                        <Box>Tipo de Evento:</Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexBasis: '100%',
                                            flex: 1
                                        }}
                                    >
                                        {communicationData?.tipoEvento?.evento}
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        width: '100%'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexBasis: '100%',
                                            flex: 1
                                        }}
                                    >
                                        <Box>Notificación:</Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexBasis: '100%',
                                            flex: 1
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1
                                            }}
                                        >
                                            <NotificationImportantIcon
                                                sx={{
                                                    color: communicationData?.notificacion
                                                        ? '#3761ED'
                                                        : '#B2B2B2'
                                                }}
                                                fontSize="small"
                                            />
                                            {communicationData?.notificacion
                                                ? 'Activo'
                                                : 'Inactivo'}
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        width: '100%'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexBasis: '100%',
                                            flex: 1
                                        }}
                                    >
                                        <Box>Push:</Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexBasis: '100%',
                                            flex: 1
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1
                                            }}
                                        >
                                            <InfoIcon
                                                sx={{
                                                    color: communicationData?.push
                                                        ? '#3761ED'
                                                        : '#3B2B2B2'
                                                }}
                                                fontSize="small"
                                            />
                                            {communicationData?.push ? 'Activo' : 'Inactivo'}
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        width: '100%'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexBasis: '100%',
                                            flex: 1
                                        }}
                                    >
                                        <Box>Email:</Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexBasis: '100%',
                                            flex: 1
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1
                                            }}
                                        >
                                            <EmailIcon
                                                sx={{
                                                    color: communicationData?.mail
                                                        ? '#3761ED'
                                                        : '#B2B2B2'
                                                }}
                                                fontSize="small"
                                            />
                                            {communicationData?.mail ? 'Activo' : 'Inactivo'}
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </SectionData>

                    <SectionTitle text="Perfiles" actionValue="perfilesEventosInfo" />
                    <SectionData>
                        <Grid container xs={12} item sm direction="row">
                            {communicationData &&
                                communicationData.notificacionesEmpresas?.length &&
                                communicationData.notificacionesEmpresas?.map(
                                    (items: any, index: number) => (
                                        <p key={Math.random()}>{items.prefil.nombre}</p>
                                    )
                                )}
                            <Grid
                                item
                                container
                                xs={6}
                                justifyContent={'end'}
                                alignItems={'flex-start'}
                            ></Grid>
                        </Grid>
                    </SectionData>

                    <SectionTitle text="Usuarios" actionValue="rolesEventosInfo" />
                    <SectionData>
                        <Grid container xs={12} item sm direction="row">
                            <Grid xs={12} sm={6} item container direction="column">
                                {communicationData &&
                                    communicationData.notificacionesUsuarios?.length > 0 &&
                                    communicationData.notificacionesUsuarios?.map(
                                        (items: any, index: number) => (
                                            <Grid item key={index}>
                                                {items?.usuario?.nombre}
                                            </Grid>
                                        )
                                    )}
                            </Grid>
                            <Grid
                                item
                                container
                                xs={6}
                                justifyContent={'end'}
                                alignItems={'flex-start'}
                            ></Grid>
                        </Grid>
                    </SectionData>
                    <SectionData>
                        <Box sx={{ mt: 4 }}>
                            <ButtonActions
                                variant="outlined"
                                confirmText={'Editar'}
                                onClick={() => {
                                    dispatch(setCommunicationData(communicationData));
                                    navigate(`${communicationData?.id}`);
                                }}
                            />
                        </Box>
                    </SectionData>
                </CardContent>
            </Card>
            {/* <ComunicacionesEvtEditDrawer
                open={open}
                setOpen={setOpen}
                setAbrirCard={setAbrirCard}
                commData={communicationData}
                parametricData={parametricData}
                refrescarDatos={refrescarDatos}
                {...props}
            /> */}
        </Box>
    );
};

export default ComunicacionInformation;
