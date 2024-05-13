import _ from 'lodash';
import { Card, CardContent, Grid } from '@mui/material';
import CollapseCard from '../../../GiroDetailContainer/Operations/CollapseCard';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import Loading from '../../../Loading';

function ShipInformationContainer(props: any) {
    const { data, loadingPatent, fetchingPatent, sectionData } = props;

    return (
        <Grid container spacing={2} mb={2}>
            {loadingPatent || fetchingPatent ? (
                <Loading size="small" />
            ) : (
                !_.isEmpty(data) && (
                    <>
                        <Grid item xs={12}>
                            <strong>Información del buque</strong>
                        </Grid>
                        <Grid item xs={12}>
                            <Card className="card-ship-operations">
                                <CardContent>
                                    {loadingPatent ? (
                                        <Loading size="small" />
                                    ) : (
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                Nombre y apellido:
                                            </Grid>
                                            <Grid item xs={6}>
                                                <b>{data?.agencia?.nombre || ''}</b>
                                            </Grid>
                                            <Grid item xs={6}>
                                                Propietario:
                                            </Grid>
                                            <Grid item xs={6}>
                                                <b>{data?.armadorPrincipal?.nombre || ''}</b>
                                            </Grid>
                                        </Grid>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <CollapseCard
                                data={sectionData?.shipData}
                                text="Identificación del buque"
                                icon={<DirectionsBoatIcon />}
                                defaultExpanded
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CollapseCard
                                data={sectionData?.certificateData}
                                text="Certificados"
                                icon={<FactCheckIcon />}
                            />
                        </Grid>
                    </>
                )
            )}
            {!loadingPatent && !fetchingPatent && !data && (
                <Grid item xs={12}>
                    <p>No se pudo cargar información.</p>
                </Grid>
            )}
        </Grid>
    );
}

export default ShipInformationContainer;
