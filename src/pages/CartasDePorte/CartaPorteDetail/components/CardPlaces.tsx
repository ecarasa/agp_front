import { Card, CardContent, Grid } from '@mui/material';
import Loading from '../../../../components/Loading';
function CardPlaces(props: any) {
    const { data, loadingWaybill, fetchingWaybill } = props;
    return (
        <Card className="card-container">
            <CardContent>
                {loadingWaybill || fetchingWaybill ? (
                    <Loading size="small" />
                ) : (
                    <>
                        <p className="info-card-title">Tipo de transporte</p>
                        <Grid container spacing={2} sx={{ padding: '16px' }}>
                            <Grid item xs={6}>
                                Origen:
                            </Grid>
                            <Grid item xs={6}>
                                <b>{data?.empresaOrigen?.nombre}</b>
                            </Grid>
                            <Grid item xs={6}>
                                Destino:
                            </Grid>
                            <Grid item xs={6}>
                                <b>{data?.empresaDestino?.nombre}</b>
                            </Grid>
                            <Grid item xs={6}>
                                Agente Ferroviario:
                            </Grid>
                            <Grid item xs={6} mb={8}>
                                <b>{data?.agenciaFerroviaria?.nombre}</b>
                            </Grid>
                        </Grid>

                        <p className="info-card-title">Itinerario Solicitud por el cliente</p>
                        <Grid container spacing={2} sx={{ padding: '16px' }}>
                            <Grid item xs={6}>
                                Lugar de carga:
                            </Grid>
                            <Grid item xs={6}>
                                <b>{data?.lugarCarga?.nombre}</b>
                            </Grid>
                            <Grid item xs={6}>
                                Lugar de descarga:
                            </Grid>
                            <Grid item xs={6}>
                                <b>{data?.lugarDescarga?.nombre}</b>
                            </Grid>
                        </Grid>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export default CardPlaces;
