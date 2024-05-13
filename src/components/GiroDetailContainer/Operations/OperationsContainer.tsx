import _ from 'lodash';
import { Card, CardContent, Grid } from '@mui/material';
import { Fragment } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import CollapseCard from './CollapseCard';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import TextsmsIcon from '@mui/icons-material/Textsms';
import Loading from '../../Loading';

function OperationsContainer(props: any) {
    const { giroData, loadingGiro, fetchingGiro, getOtherAssemblers, sectionData } = props;

    return (
        <Grid container spacing={2} mb={2}>
            {loadingGiro || fetchingGiro ? (
                <Loading size="small" />
            ) : (
                !_.isEmpty(giroData) && (
                    <>
                        <Grid item xs={12}>
                            <strong>Operaciones del buque</strong>
                        </Grid>
                        <Grid item xs={12}>
                            <Card className="card-ship-operations">
                                <CardContent>
                                    {loadingGiro ? (
                                        <Loading size="small" />
                                    ) : (
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                Nombre y apellido:
                                            </Grid>
                                            <Grid item xs={6}>
                                                <b>{giroData?.agencia?.nombre || ''}</b>
                                            </Grid>
                                            <Grid item xs={6}>
                                                Carga compartida con Propietarios:
                                            </Grid>
                                            <Grid item xs={6}>
                                                <b>{getOtherAssemblers() || ''}</b>
                                            </Grid>
                                            <Grid item xs={6}>
                                                Propietario:
                                            </Grid>
                                            <Grid item xs={6}>
                                                <b>{giroData?.armadorPrincipal?.nombre || ''}</b>
                                            </Grid>
                                        </Grid>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card className="card-ship-operations">
                                <CardContent>
                                    {loadingGiro ? (
                                        <Loading size="small" />
                                    ) : _.isEmpty(giroData) ? (
                                        <p>No se pudo cargar información.</p>
                                    ) : (
                                        <Grid container spacing={2}>
                                            {_.entries(sectionData?.dimensions).map(
                                                ([key, value]: any) => (
                                                    <Fragment key={key}>
                                                        <Grid item xs={6}>
                                                            {key}:
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <b>{value}</b>
                                                        </Grid>
                                                    </Fragment>
                                                )
                                            ) || null}
                                        </Grid>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                        {false && (
                            <Grid item xs={12}>
                                <CollapseCard
                                    data={sectionData?.messageData}
                                    text="Identificación del mensaje"
                                    icon={<TextsmsIcon />}
                                />
                            </Grid>
                        )}
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
                        {false && (
                            <Grid item xs={12}>
                                <CollapseCard
                                    data={sectionData?.conversationHistory}
                                    text="Historial de conversación"
                                    icon={<ChatIcon />}
                                />
                            </Grid>
                        )}
                    </>
                )
            )}
            {!loadingGiro && !fetchingGiro && !giroData && (
                <Grid item xs={12}>
                    <p>No se pudo cargar información.</p>
                </Grid>
            )}
        </Grid>
    );
}

export default OperationsContainer;
