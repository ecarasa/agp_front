import { Box, Grid } from '@mui/material';
import Button from '../../../../components/button/Button';
import DockingAndShipData from './components/DockingAndShipData';
import RequestServiceData from './components/RequestServiceData';
import SectionFormAccordion from '../../../../components/SectionFormAccordion/SectionFormAccordion';
import SectionHeader from '../../../../components/SectionHeader';
import useGlobalFilters from '../../../../hooks/useGlobalFilters';
import useServiceRequest from './hooks/useServiceRequest';
import WarningAlert from '../../../../components/WarningAlert';

function ServiciosRequest() {
    const { filters, ...filterProps } = useGlobalFilters();
    const { addingServiceRequest, resetInputs, handleSubmit, ...props } = useServiceRequest({
        filters
    });

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>Solicitud Servicios a la Nave</SectionHeader.Title>
            </SectionHeader>

            <Box
                component="form"
                sx={{ padding: { sm: 0, md: '0 65px' } }}
                justifyContent="center"
                onSubmit={(e: any) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <>
                    <Grid container spacing={4}>
                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <Button onClick={() => resetInputs()} type="outlined">
                                Limpiar
                            </Button>
                        </Grid>
                        {props?.data?.idBuque && !props?.data?.idBuque?.giros?.length && (
                            <Grid item xs={12}>
                                <WarningAlert>
                                    <>El buque seleccionado no posee giros asignados</>
                                </WarningAlert>
                            </Grid>
                        )}
                    </Grid>
                    <SectionFormAccordion title="Datos de Giros y Buque" staticDropDown>
                        <DockingAndShipData {...props} {...filterProps} />
                    </SectionFormAccordion>
                    <SectionFormAccordion title="Datos de Servicio" staticDropDown>
                        <RequestServiceData {...props} />
                    </SectionFormAccordion>

                    <Box className="flex-center" mt={4}>
                        <Button strong loading={addingServiceRequest} disabled={false}>
                            Finalizar
                        </Button>
                    </Box>
                </>
            </Box>
        </>
    );
}

export default ServiciosRequest;
