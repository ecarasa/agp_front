import { Grid } from '@mui/material';
import dayjs from 'dayjs';

function FragmentModalAtraque({ data }: any) {
    return (
        <Grid container textAlign="left" sx={{ padding: { sm: 0, md: '0 70px' } }}>
            <Grid item xs={6}>
                ID Conversación
            </Grid>
            <Grid item xs={6}>
                {data?.uuidConversacion}
            </Grid>
            <Grid item xs={6}>
                Emisor
            </Grid>
            <Grid item xs={6}>
                {data?.emisor}
            </Grid>
            <Grid item xs={6}>
                Tipo Mensaje
            </Grid>
            <Grid item xs={6}>
                {`${data?.evento} - ${data?.mensaje}`}
            </Grid>
            <Grid item xs={6}>
                Buque
            </Grid>
            <Grid item xs={6}>
                {data?.buque}
            </Grid>
            <Grid item xs={6}>
                Fecha de arribo
            </Grid>
            <Grid item xs={6}>
                {dayjs(data?.fechaArribo).format('DD-MM-YYYY HH:mm') + ' hs'}
            </Grid>
        </Grid>
    );
}

export default FragmentModalAtraque;
