import _ from 'lodash';
import { Box, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AttributesForm from './AttributesForm';
import Button from '../../../../components/button/Button';
import CloseButton from '../../../../components/CloseButton';
import Loading from '../../../../components/Loading';
import OperationButtons from './OperationButtons';
import ServiceInformation from './ServiceInformation';

function ServiceInfoCard(props: any) {
    const {
        handleCloseCard,
        handleOpenDrawer,
        requestById,
        loadingRequestData,
        fetchingRequestData,
        isError,
        provisiones,
        liquidado,
        handleChange,
        handleLogProvisions,
        loadingServiceData,
        fetchingServiceData,
        access,
        ...restProps
    } = props;
    const navigate = useNavigate();

    const loading =
        loadingServiceData || fetchingServiceData || loadingRequestData || fetchingRequestData;

    return (
        <Box>
            <Card className="card-container" variant="outlined" sx={{ height: 'inherit' }}>
                <CardContent>
                    <CloseButton position="right" onClose={handleCloseCard} />

                    {!loadingRequestData && !fetchingRequestData && requestById && !isError && (
                        <p className="info-card-title">{requestById?.servicio?.nombre}</p>
                    )}

                    <Box
                        sx={{ height: '500px', overflowY: 'auto' }}
                        mt={2}
                        component="form"
                        onSubmit={(e: any) => {
                            e.preventDefault();
                            handleLogProvisions();
                        }}
                    >
                        {loading ? (
                            <Loading size="small" />
                        ) : requestById && !isError ? (
                            <Grid
                                container
                                spacing={1}
                                p={2}
                                sx={{
                                    '& .data-cell': {
                                        textAlign: 'right',
                                        fontWeight: 500
                                    }
                                }}
                            >
                                <ServiceInformation requestById={requestById} />

                                <AttributesForm
                                    provisiones={provisiones}
                                    handleChange={handleChange}
                                    liquidado={liquidado}
                                    requestById={requestById}
                                    {...restProps}
                                />

                                {!liquidado ? (
                                    <OperationButtons>
                                        <>
                                            {!!access?.[3]?.[85] &&
                                                requestById?.estado !== 'CANCELADO' && (
                                                    <Button strong type="outlined">
                                                        REGISTRAR
                                                    </Button>
                                                )}

                                            {!!access?.[3]?.[86] &&
                                                requestById?.estado === 'APROVISIONADO' && (
                                                    <Button
                                                        strong
                                                        onClick={() =>
                                                            navigate(
                                                                `liquidacion/${requestById.id}/detalle`
                                                            )
                                                        }
                                                    >
                                                        LIQUIDAR
                                                    </Button>
                                                )}
                                        </>
                                    </OperationButtons>
                                ) : (
                                    !!access?.[3]?.[87] && (
                                        <Grid item mt={4} xs={12} className="flex-center">
                                            <Button
                                                strong
                                                type="outlined"
                                                onClick={() =>
                                                    navigate(
                                                        `liquidacion/${requestById.id}/detalle`
                                                    )
                                                }
                                            >
                                                Ver Liquidación
                                            </Button>
                                        </Grid>
                                    )
                                )}
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

export default ServiceInfoCard;
