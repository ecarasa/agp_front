import { Box, Card, CardContent, Grid, TextareaAutosize } from '@mui/material';
import CloseButton from '../../../../components/CloseButton';
import Input from '../../../../components/Input/Input';
import Loading from '../../../../components/Loading';
import styles from '../styles.module.css';
import WagonStates from '../../components/WagonStates';

function WagonDetailCard(props: any) {
    const { onClose, children, selected, loadingWaybill, fetchingWaybill } = props;

    return (
        <Box>
            <Card className="card-container" variant="outlined" sx={{ height: 'inherit' }}>
                <CardContent sx={{ minHeight: 500 }}>
                    <CloseButton position="right" onClose={onClose} />
                    {loadingWaybill || fetchingWaybill ? (
                        <Loading size="small" />
                    ) : (
                        <>
                            <p className="info-card-title">Datos de Vagón</p>
                            <Grid container spacing={1} p={2}>
                                <Grid item xs={6} mt={1}>
                                    Estado:
                                </Grid>
                                <Grid item xs={6} className="flex-align-center">
                                    <WagonStates
                                        states={{
                                            estado: selected?.estado
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6} mt={1}>
                                    Estado Inspección:
                                </Grid>
                                <Grid item xs={6} className="flex-align-center">
                                    <WagonStates
                                        states={{
                                            estado: selected?.estado,
                                            estadoInspeccion: selected?.inspeccion?.estado,
                                            inspectionTable: true
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    Vagón:
                                </Grid>
                                <Grid item xs={6}>
                                    <b>{selected?.nroVagon || 'N/A'}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    Contenedor:
                                </Grid>
                                <Grid item xs={6}>
                                    <b>{selected?.nroContenedor || 'N/A'}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    Bultos:
                                </Grid>
                                <Grid item xs={6}>
                                    <b>{selected?.cantidadBultos || 'N/A'}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    Descripción de Carga:
                                </Grid>
                                <Grid item xs={6}>
                                    <b>{selected?.descripcion || 'N/A'}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    Precinto:
                                </Grid>
                                <Grid item xs={6}>
                                    <b>{selected?.nroPrecinto || 'N/A'}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    Color:
                                </Grid>
                                <Grid item xs={6}>
                                    <b>{selected?.colorPrecinto || 'N/A'}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    Peso en Kg:
                                </Grid>
                                <Grid item xs={6}>
                                    <b>{selected?.pesoAforo || 'N/A'}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    Peso Verificado:
                                </Grid>
                                <Grid item xs={6}>
                                    <b>{selected?.pesoVerificado || 'N/A'}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    Capacidad de Carga:
                                </Grid>
                                <Grid item xs={6}>
                                    <b>{selected?.capacidadCarga || 'N/A'}</b>
                                </Grid>
                                {selected?.inspeccion?.estado === 'Observado' && (
                                    <>
                                        <Grid item xs={12} mt={2}>
                                            <Input
                                                label="Motivo de observación"
                                                readOnly
                                                value={
                                                    selected?.inspeccion?.tipoInconveniente
                                                        ?.descripcion
                                                }
                                            />
                                        </Grid>
                                    </>
                                )}
                                {selected?.estado !== 'Pendiente' && (
                                    <Grid item xs={12} mt={2}>
                                        <TextareaAutosize
                                            minRows={3}
                                            maxRows={8}
                                            name="nota"
                                            readOnly
                                            placeholder="Nota"
                                            value={selected?.inspeccion?.observacion || ''}
                                            style={{
                                                color: 'black',
                                                padding: '10px',
                                                fontSize: '16px'
                                            }}
                                        />
                                    </Grid>
                                )}
                                {children && (
                                    <Grid item xs={12}>
                                        {children}
                                    </Grid>
                                )}
                            </Grid>
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

export default WagonDetailCard;
