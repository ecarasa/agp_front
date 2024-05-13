import { Box, Grid, Paper, TextareaAutosize } from '@mui/material';
import { requestServiceState } from '../../../../../utils/functions';
import { getDateTime } from '../../../../../utils/common';

function DatosSolicitud(props: any) {
    const { data } = props;

    return (
        <Box>
            <p>Datos de la Solicitud</p>
            <Paper sx={{ border: '1px solid #D9D9D9', borderRadius: '12px' }}>
                <Grid container spacing={2} p={2} sx={{ fontSize: 16 }}>
                    <Grid item xs={12} md={6}>
                        <Grid
                            container
                            spacing={2}
                            p={2}
                            sx={{
                                '& .MuiGrid-item': {
                                    paddingTop: '8px'
                                },
                                '& .MuiGrid-item.text-strong': {
                                    fontWeight: 800,
                                    textAlign: 'right'
                                }
                            }}
                        >
                            <Grid item xs={6}>
                                {requestServiceState(data)}
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                <b>{getDateTime(data?.fecha)}</b>
                            </Grid>
                            <Grid item xs={6}>
                                Solicitante:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {data?.agenciaMaritima?.nombre || 'N/A'}
                            </Grid>
                            <Grid item xs={6}>
                                Buque:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {data?.buque?.nombre}
                            </Grid>
                            <Grid item xs={6}>
                                Giro:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {data?.giro?.id}
                            </Grid>
                            <Grid item xs={6}>
                                Gerencia:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {data?.servicio?.gerencia?.nombre || 'N/A'}
                            </Grid>
                            <Grid item xs={6}>
                                Empresa:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {data?.servicio?.prestadores[0]?.nombre || 'N/A'}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Grid
                            container
                            spacing={2}
                            p={2}
                            sx={{
                                '& .MuiGrid-item': {
                                    paddingTop: '8px'
                                },
                                '& .MuiGrid-item.text-strong': {
                                    fontWeight: 800,
                                    textAlign: 'right'
                                }
                            }}
                        >
                            <Grid item xs={6}>
                                Servicio Solicitado:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {data?.servicio?.nombre}
                            </Grid>
                            <Grid item xs={6}>
                                Ingreso Giro:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {getDateTime(data?.giro?.fechaEntradaVanguardia)}
                            </Grid>
                            <Grid item xs={6}>
                                Salida Giro:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {getDateTime(data?.giro?.fechaSalidaVanguardia)}
                            </Grid>
                            <Grid item xs={6}>
                                Muelle:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {data?.movimiento?.muelle?.nombre || 'N/A'}
                            </Grid>
                            <Grid item xs={6}>
                                Terminal:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {data?.movimiento?.terminal?.sigla || 'N/A'}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid
                            container
                            spacing={2}
                            p={2}
                            sx={{
                                '& .MuiGrid-item': {
                                    paddingTop: '8px'
                                },
                                '& .MuiGrid-item.text-strong': {
                                    fontWeight: 800,
                                    textAlign: 'right'
                                }
                            }}
                        >
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    minRows={3}
                                    maxRows={10}
                                    style={{
                                        color: 'black',
                                        padding: '10px',
                                        fontSize: '16px'
                                    }}
                                    onChange={(e: any) => null}
                                    value={data?.nota}
                                    readOnly
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}

export default DatosSolicitud;
