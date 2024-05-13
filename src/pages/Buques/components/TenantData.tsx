import { Grid } from '@mui/material';
import { getDate } from '../../../utils/common';

function TenantData({ shipFullData }: any) {
    return (
        <Grid container spacing={1} mt={0.5}>
            <Grid item xs={12} sx={{ fontSize: '15px' }}>
                <strong>Locatario</strong>
            </Grid>
            <Grid item xs={12}>
                Nombre:&nbsp;
                <strong>{shipFullData?.locatario?.nombre || ''}</strong>
            </Grid>
            <Grid item xs={12}>
                Domicilio:&nbsp;
                <strong>{shipFullData?.locatario?.domicilio || ''}</strong>
            </Grid>
            <Grid item xs={12}>
                Teléfono:&nbsp;
                <strong>{shipFullData?.locatario?.telefono || ''}</strong>
            </Grid>
            <Grid item xs={12}>
                Fecha desde:&nbsp;
                <strong>
                    {shipFullData?.locatario?.fechaDesde &&
                        getDate(shipFullData?.locatario?.fechaDesde)}
                </strong>
            </Grid>
            <Grid item xs={12}>
                Fecha hasta:&nbsp;
                <strong>
                    {shipFullData?.locatario?.fechaHasta &&
                        getDate(shipFullData?.locatario?.fechaHasta)}
                </strong>
            </Grid>
        </Grid>
    );
}

export default TenantData;
