import { Box, Card, CardContent, Grid } from '@mui/material';
import { getDateTime } from '../../../utils/common';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button';
import CloseButton from '../../../components/CloseButton';

function SideCard(props: any) {
    const { handleCloseCard, data } = props;
    const navigate = useNavigate();

    return (
        <Box>
            <Card className="card-container" variant="outlined" sx={{ height: 'inherit' }}>
                <CardContent>
                    <CloseButton position="right" onClose={handleCloseCard} />

                    <p className="info-card-title">Información de Formación</p>

                    <Box sx={{ minheight: '500px' }}>
                        {data ? (
                            <Grid container spacing={2} p={2}>
                                <Grid item xs={5} mt={2} sx={{ fontSize: '20px' }}>
                                    <b>{data?.ingreso ? 'Ingreso' : 'Egreso'}</b>
                                </Grid>
                                <Grid item xs={7} textAlign="right" mt={2}>
                                    <b>{getDateTime(data?.fecha)}</b>
                                </Grid>
                                <Grid item xs={5} mt={4}>
                                    Vagones:
                                </Grid>
                                <Grid item xs={7} mt={4} textAlign="right" sx={{ fontWeight: 500 }}>
                                    {data?.cantidadVagones}
                                </Grid>
                                <Grid item xs={5}>
                                    Empresa Ferroviaria:
                                </Grid>
                                <Grid item xs={7} textAlign="right" sx={{ fontWeight: 500 }}>
                                    {data?.ferrocarril?.nombre}
                                </Grid>
                                <Grid item xs={5}>
                                    Maquinista:
                                </Grid>
                                <Grid item xs={7} textAlign="right" sx={{ fontWeight: 500 }}>
                                    {data?.maquinista || 'N/A'}
                                </Grid>
                                <Grid item xs={5}>
                                    Locomotora:
                                </Grid>
                                <Grid item xs={7} textAlign="right" sx={{ fontWeight: 500 }}>
                                    {data?.nroLocomotora || ''}
                                </Grid>
                                <Grid item xs={5}>
                                    Número de Formación:
                                </Grid>
                                <Grid item xs={7} textAlign="right" sx={{ fontWeight: 500 }}>
                                    {data?.id}
                                </Grid>
                                <Grid item xs={5}>
                                    Parrilla:
                                </Grid>
                                <Grid item xs={7} textAlign="right" sx={{ fontWeight: 500 }}>
                                    {data?.parrilla?.nombre}
                                </Grid>
                                <Grid item mt={8} xs={12} className="flex-center">
                                    <Button
                                        style={{
                                            border: '2px solid var(--primary)',
                                            fontWeight: 700
                                        }}
                                        type="outlined"
                                        onClick={() => navigate(`${data?.id}/cartas-porte`)}
                                    >
                                        VER CARTAS DE PORTE
                                    </Button>
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

export default SideCard;
