import { Card, CardContent, Grid } from '@mui/material';
import { getDateTime } from '../../../utils/common';
import Button from '../../button/Button';
import EditIcon from '@mui/icons-material/Edit';
import Loading from '../../Loading';

function TripGeneralInformation({
    data,
    getPorts,
    handleEditGeneralInfo,
    loadingGiro,
    fetchingGiro,
    access
}: any) {
    return (
        <>
            <Card className="card-ship-operations">
                <CardContent>
                    {loadingGiro || fetchingGiro ? (
                        <Loading size="medium" />
                    ) : (
                        <Grid container spacing={2}>
                            <Grid item xs={6} sx={{ display: 'inline-flex', alignItems: 'center' }}>
                                <strong>Información general del viaje</strong>
                                {fetchingGiro && <Loading size="extrasmall" />}
                            </Grid>
                            <Grid
                                item
                                xs={6}
                                display="flex"
                                alignItems="right"
                                justifyContent="right"
                            >
                                {!!access?.[2]?.[25] && (
                                    <Button
                                        type="text"
                                        endIcon={<EditIcon />}
                                        disabled={
                                            !!data?.fechaSalidaVanguardia &&
                                            data?.estado !== 'revision'
                                        }
                                        onClick={() => handleEditGeneralInfo()}
                                    >
                                        Editar
                                    </Button>
                                )}
                            </Grid>
                            <Grid item xs={6}>
                                Procedencia:
                            </Grid>
                            <Grid item xs={6}>
                                {getPorts('O')}
                            </Grid>
                            <Grid item xs={6}>
                                Destino:
                            </Grid>
                            <Grid item xs={6}>
                                {getPorts('D')}
                            </Grid>
                            <Grid item xs={6}>
                                Fecha ingreso a RADA:
                            </Grid>
                            <Grid item xs={6}>
                                {getDateTime(data?.fechaIngresoRada)}
                            </Grid>
                            <Grid item xs={6}>
                                Tráfico:
                            </Grid>
                            <Grid item xs={6}>
                                {data?.tipoTrafico?.nombre || ''}
                            </Grid>
                            <Grid item xs={6}>
                                Operación:
                            </Grid>
                            <Grid item xs={6}>
                                {data?.tipoOperacion?.nombre || ''}
                            </Grid>
                            <Grid item xs={6}>
                                Ingreso Vanguardia:
                            </Grid>
                            <Grid item xs={6}>
                                {getDateTime(data?.fechaEntradaVanguardia)}
                            </Grid>
                            <Grid item xs={6}>
                                Salida Vanguardia:
                            </Grid>
                            <Grid item xs={6}>
                                {getDateTime(data?.fechaSalidaVanguardia)}
                            </Grid>
                        </Grid>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

export default TripGeneralInformation;
