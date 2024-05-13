import { Box, Grid } from '@mui/material';
import Button from '../../../../components/button/Button';
import DatosAtributos from './components/DatosAtributos';
import DatosLiquidacion from '../../../../components/GestionPasavantes/components/DatosLiquidacion';
import DatosSolicitud from './components/DatosSolicitud';
import Loading from '../../../../components/Loading';
import SectionBody from '../../../../components/SectionBody';
import SectionHeader from '../../../../components/SectionHeader';
import useServiceLiquidation from './hooks/useServiceLiquidation';

function LiquidacionContainer() {
    const { handleSubmit, getDisabledValidation, liquidatingService, ...props } =
        useServiceLiquidation();

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>Información de Solicitud de Servicio</SectionHeader.Title>
            </SectionHeader>

            <SectionBody>
                {props?.loadingRequestData || props?.fetchingRequestData ? (
                    <Loading size="medium" />
                ) : (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <DatosSolicitud {...props} />
                        </Grid>
                        <Grid item xs={12}>
                            <DatosAtributos {...props} />
                        </Grid>
                        <Grid item xs={12}>
                            <DatosLiquidacion {...props} />
                        </Grid>
                        {props?.data?.estado !== 'LIQUIDADO' && (
                            <Grid item xs={12} justifyContent="center" display="flex" mt={8}>
                                <Box>
                                    <Button
                                        strong
                                        onClick={() => handleSubmit()}
                                        disabled={getDisabledValidation()}
                                        loading={liquidatingService}
                                    >
                                        Finalizar
                                    </Button>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                )}
            </SectionBody>
        </>
    );
}

export default LiquidacionContainer;
