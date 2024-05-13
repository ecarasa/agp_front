import { ReactNode } from 'react';
import { Grid } from '@mui/material';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CloseButton from '../../../components/CloseButton';
import styles from './styles.module.css';
import { ComunicacionesCertificado } from '../ComunicacionesIndex';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ButtonActions from '../../../components/ButtonActions';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SectionHeader from '../../../components/SectionHeader';
import { setCommunicationData } from '../../../features/slices/applicationSlice';
interface ContentProp {
    children: ReactNode;
}

interface ComCertificadosProps {
    communicationData?: ComunicacionesCertificado | null;
    onClose?: () => any;
    cambioEstado?: any;
    refrescarDatos: any;
    setAbrirCard: any;
}

const ComunicacionInformation = ({ communicationData, onClose }: ComCertificadosProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const SectionData = ({ children }: ContentProp) => (
        <div className={styles['section-data']}>{children}</div>
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
                            mt: 4,
                            mb: 6
                        }}
                    >
                        <Box>
                            <EventAvailableIcon sx={{ color: '#000', fontSize: 38 }} />
                            <Box>
                                <strong>{communicationData?.titulo}</strong>
                            </Box>
                            <Box sx={{ color: '#000', fontSize: 14 }}>
                                {communicationData?.mensajeCorto}
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
                                        <Box>Tipo de certificado:</Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexBasis: '100%',
                                            flex: 1
                                        }}
                                    >
                                        {communicationData?.titulo}
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
                                        <Box>Tipo de Aviso:</Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexBasis: '100%',
                                            flex: 1
                                        }}
                                    >
                                        {communicationData?.tipo}
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
                                        <Box>Aviso:</Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexBasis: '100%',
                                            flex: 1
                                        }}
                                    >
                                        {communicationData?.aviso}
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
            {/* <ComunicacionesEditDrawer
                open={open}
                setOpen={setOpen}
                commData={communicationData}
                refrescarDatos={refrescarDatos}
                setAbrirCard={setAbrirCard}
                {...props}
            /> */}
        </Box>
    );
};

export default ComunicacionInformation;
