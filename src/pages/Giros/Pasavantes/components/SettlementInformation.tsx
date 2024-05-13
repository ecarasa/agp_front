import { Grid } from '@mui/material';
import { getDateTime } from '../../../../utils/common';

function SettlementInformation({ billing }: any) {
    return (
        <>
            <Grid item xs={12}>
                <Grid
                    container
                    spacing={2}
                    textAlign="center"
                    display="flex"
                    justifyContent="space-evenly"
                    fontSize={16}
                    mt={2}
                    mb={2}
                >
                    <Grid item>
                        Usuario Liquidación: <b>{billing?.usuarioLiquidacion?.nombre || 'N/A'}</b>
                    </Grid>
                    <Grid item>
                        Fecha Liquidación: <b>{getDateTime(billing?.fechaLiquidacion) || 'N/A'}</b>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export default SettlementInformation;
