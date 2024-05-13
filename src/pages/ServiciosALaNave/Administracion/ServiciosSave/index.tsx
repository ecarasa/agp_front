import { Box, Divider, Grid } from '@mui/material';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import AttributeDetailCard from './components/AttributeDetailCard';
import AttributesTable from './components/AttributesTable';
import Button from '../../../../components/button/Button';
import Loading from '../../../../components/Loading';
import SectionFormAccordion from '../../../../components/SectionFormAccordion/SectionFormAccordion';
import SectionHeader from '../../../../components/SectionHeader';
import ServiceAttributes from './components/ServiceAttributes';
import ServiceData from './components/ServiceData';
import useServiciosSave from './hooks/useServiciosSave';
import useUserAccess from '../../../../hooks/useUserAccess';

function ServiciosSave() {
    const access = useUserAccess();
    const { isMobile, isTablet } = useIsMobile();
    const {
        id,
        openCard,
        addingService,
        edittingService,
        loadingServiceById,
        fetchingServiceById,
        serviceByIdError,
        getDisabledSubmitButton,
        handleSubmit,
        ...props
    } = useServiciosSave();

    let title = 'Consulta';

    if (id) {
        if (!!access?.[3]?.[90] && !!access?.[3]?.[73]) {
            title = 'Editar';
        }
    } else {
        title = 'Nuevo';
    }

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>{title + ' Servicio a la Nave'}</SectionHeader.Title>
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
                {id && (loadingServiceById || fetchingServiceById) ? (
                    <Loading size="medium" />
                ) : id && serviceByIdError ? (
                    <p>No se pudo cargar la información.</p>
                ) : (
                    <>
                        <SectionFormAccordion title="Datos del Servicio">
                            <ServiceData {...props} id={id} />
                        </SectionFormAccordion>
                        <SectionFormAccordion title="Atributos">
                            <ServiceAttributes {...props} />
                        </SectionFormAccordion>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Divider
                                    sx={{
                                        border: '1px solid #005093',
                                        width: '95%',
                                        margin: '0 auto'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="flex-start"
                                    spacing={3}
                                >
                                    {openCard && (isMobile || isTablet) ? null : (
                                        <Grid
                                            item
                                            xs={openCard ? 6 : 12}
                                            lg={openCard ? 8 : 12}
                                            mb={2}
                                        >
                                            <AttributesTable {...props} />
                                        </Grid>
                                    )}
                                    {openCard && (
                                        <Grid
                                            item
                                            mb={2}
                                            xs={!isMobile && !isTablet ? 6 : 12}
                                            lg={!isMobile && !isTablet ? 4 : 12}
                                        >
                                            <AttributeDetailCard {...props} id={id} />
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                        {!!access?.[3]?.[73] && (
                            <Box className="flex-center" mt={4}>
                                <Button
                                    strong
                                    loading={addingService || edittingService}
                                    disabled={getDisabledSubmitButton()}
                                >
                                    {!!id ? 'Guardar' : 'Finalizar'}
                                </Button>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </>
    );
}

export default ServiciosSave;
