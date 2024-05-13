import { Box, Checkbox, FormControlLabel, Grid, Paper } from '@mui/material';
import { getDateTime } from '../../../../utils/common';
import Input from '../../../../components/Input/Input';

function PasavanteGeneralData(props: any) {
    const { data, getPorts } = props;
    return (
        <Box>
            <p>Información general del viaje</p>
            <Paper sx={{ border: '1px solid #D9D9D9', borderRadius: '12px' }}>
                <Grid container spacing={2} p={4} sx={{ fontSize: 16 }}>
                    <Grid item xs={12} md={4}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <span>Procedencia: {getPorts('O')}</span>
                            </Grid>
                            <Grid item xs={12}>
                                <span>Destino: {getPorts('D')}</span>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Input
                            label="Tráfico"
                            size="small"
                            readOnly
                            value={data?.tipoTrafico?.nombre || ''}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Input
                            label="Operación"
                            size="small"
                            readOnly
                            value={data?.tipoOperacion?.nombre || ''}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Input
                            label="Entrada de Vanguardia"
                            size="small"
                            readOnly
                            value={getDateTime(data?.fechaEntradaVanguardia) || ''}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Input
                            label="Salida de Vanguardia"
                            size="small"
                            readOnly
                            value={getDateTime(data?.fechaSalidaVanguardia) || ''}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControlLabel
                            sx={{ width: 'auto' }}
                            control={
                                <Checkbox
                                    disabled
                                    name="buqueInactivo"
                                    value={data?.buqueInactivoPuerto || false}
                                    checked={data?.buqueInactivoPuerto || false}
                                />
                            }
                            label="Buque inactivo"
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}

export default PasavanteGeneralData;
