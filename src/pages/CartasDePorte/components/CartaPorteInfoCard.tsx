import { Box, Card, CardContent, Grid } from '@mui/material';
import { getDateTime } from '../../../utils/common';
import { getStateIcon } from '../CartasPorteIndex';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button';
import CloseButton from '../../../components/CloseButton';
import Loading from '../../../components/Loading';

function CartaPorteInfoCard(props: any) {
    const { handleCloseCard, loadingWaybill, fetchingWaybill, cartaPorteById, isError, isAGP } =
        props;
    const navigate = useNavigate();

    return (
        <Box>
            <Card className="card-container" variant="outlined" sx={{ height: 'inherit' }}>
                <CardContent>
                    <CloseButton position="right" onClose={handleCloseCard} />

                    {!loadingWaybill && !fetchingWaybill && cartaPorteById && !isError && (
                        <p className="info-card-title">Carta de Porte {cartaPorteById?.id}</p>
                    )}

                    <Box sx={{ height: '500px' }}>
                        {loadingWaybill || fetchingWaybill ? (
                            <Loading size="small" />
                        ) : cartaPorteById && !isError ? (
                            <Grid container spacing={1} p={2}>
                                <Grid item xs={6} mt={2}>
                                    <div className="flex-align-center">
                                        {getStateIcon(cartaPorteById?.estado)}
                                        &nbsp;{cartaPorteById?.estado}
                                    </div>
                                </Grid>
                                <Grid item xs={6} textAlign="right" mt={2}>
                                    {getDateTime(cartaPorteById?.fecha)}
                                </Grid>

                                <Grid item xs={6} mt={4}>
                                    Total de Vagones:
                                </Grid>
                                <Grid item xs={6} mt={4} textAlign="right" sx={{ fontWeight: 500 }}>
                                    {cartaPorteById?.totalVagones}
                                </Grid>
                                <Grid item xs={6}>
                                    Vagones por ingresar:
                                </Grid>
                                <Grid item xs={6} textAlign="right" sx={{ fontWeight: 500 }}>
                                    {cartaPorteById?.totalVagonesPendientes}
                                </Grid>
                                <Grid item xs={6}>
                                    Origen:
                                </Grid>
                                <Grid item xs={6} textAlign="right" sx={{ fontWeight: 500 }}>
                                    {cartaPorteById?.empresaOrigen?.nombre || ''}
                                </Grid>
                                <Grid item xs={6}>
                                    Destino:
                                </Grid>
                                <Grid item xs={6} textAlign="right" sx={{ fontWeight: 500 }}>
                                    {cartaPorteById?.empresaDestino?.nombre || ''}
                                </Grid>
                                <Grid item xs={6}>
                                    Agente Ferroviario:
                                </Grid>
                                <Grid item xs={6} textAlign="right" sx={{ fontWeight: 500 }}>
                                    {cartaPorteById?.agenciaFerroviaria?.nombre}
                                </Grid>
                                <Grid item mt={8} xs={12} className="flex-center">
                                    <Box
                                        className="flex-center"
                                        sx={{
                                            flexDirection: 'column',
                                            width: '300px',
                                            gap: '15px'
                                        }}
                                    >
                                        <Button
                                            type="outlined"
                                            onClick={() =>
                                                navigate(`${cartaPorteById?.id}/detalle`)
                                            }
                                        >
                                            DETALLE DE CARTA DE PORTE
                                        </Button>
                                        {isAGP && (
                                            <Button
                                                onClick={() =>
                                                    navigate(`${cartaPorteById?.id}/inspeccion`)
                                                }
                                            >
                                                INSPECCIONAR VAGONES
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        ) : (
                            <Box m={2} className="flex-center">
                                <p>No se pudo cargar la información.</p>
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default CartaPorteInfoCard;
