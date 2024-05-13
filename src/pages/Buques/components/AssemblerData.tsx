import { Grid } from '@mui/material';

function AssemblerData({ shipFullData }: any) {
    return (
        <Grid container spacing={1} mt={0.5}>
            <Grid item xs={12} sx={{ fontSize: '15px' }}>
                <strong>Propietario</strong>
            </Grid>
            <Grid item xs={12}>
                Nombre:&nbsp;
                <strong>{shipFullData?.armador?.nombre || ''}</strong>
            </Grid>
            <Grid item xs={12}>
                Domicilio:&nbsp;
                <strong>{shipFullData?.armador?.domicilio || ''}</strong>
            </Grid>
            <Grid item xs={12}>
                Teléfono:&nbsp;
                <strong>{shipFullData?.armador?.telefono || ''}</strong>
            </Grid>
            {/* <Grid item xs={12}>
                email:&nbsp;
                <strong>{shipFullData?.armador?.email || ''}</strong>
            </Grid> */}
        </Grid>
    );
}

export default AssemblerData;
