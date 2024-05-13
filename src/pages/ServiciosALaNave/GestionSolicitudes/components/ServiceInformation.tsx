import { Grid, TextareaAutosize } from '@mui/material';
import { requestServiceState } from '../../../../utils/functions';
import { getDateTime } from '../../../../utils/common';

function ServiceInformation({ requestById }: any) {
    return (
        <>
            <Grid item xs={5}>
                {requestServiceState(requestById)}
            </Grid>
            <Grid item xs={7} textAlign="right">
                <b>{getDateTime(requestById?.fecha)}</b>
            </Grid>
            <Grid item xs={5} mt={2}>
                Solicitante:
            </Grid>
            <Grid item xs={7} mt={2} className="data-cell">
                {requestById?.agenciaMaritima?.nombre}
            </Grid>
            <Grid item xs={5}>
                Buque:
            </Grid>
            <Grid item xs={7} className="data-cell">
                {requestById?.buque?.nombre}
            </Grid>
            <Grid item xs={5}>
                Giro:
            </Grid>
            <Grid item xs={7} className="data-cell">
                {requestById?.giro?.id}
            </Grid>
            <Grid item xs={5}>
                Ingreso Giro:
            </Grid>
            <Grid item xs={7} className="data-cell">
                {getDateTime(requestById?.giro?.fechaEntradaVanguardia)}
            </Grid>
            <Grid item xs={5}>
                Salida Giro:
            </Grid>
            <Grid item xs={7} className="data-cell">
                {getDateTime(requestById?.giro?.fechaSalidaVanguardia)}
            </Grid>
            <Grid item xs={5}>
                Gerencia:
            </Grid>
            <Grid item xs={7} className="data-cell">
                {requestById?.servicio?.gerencia?.nombre || 'N/A'}
            </Grid>
            <Grid item xs={5}>
                Empresa:
            </Grid>
            <Grid item xs={7} className="data-cell">
                {requestById?.servicio?.prestadores[0]?.nombre || 'N/A'}
            </Grid>
            <Grid item xs={5}>
                Muelle:
            </Grid>
            <Grid item xs={7} className="data-cell">
                {requestById?.movimiento?.muelle?.nombre}
            </Grid>
            <Grid item xs={5}>
                Terminal:
            </Grid>
            <Grid item xs={7} className="data-cell">
                {requestById?.movimiento?.terminal?.sigla}
            </Grid>
            <Grid item xs={12} mt={2}>
                <TextareaAutosize
                    minRows={3}
                    maxRows={10}
                    style={{
                        color: 'black',
                        padding: '10px',
                        fontSize: '16px'
                    }}
                    readOnly
                    onChange={(e: any) => null}
                    value={requestById?.nota || ''}
                />
            </Grid>
        </>
    );
}

export default ServiceInformation;
