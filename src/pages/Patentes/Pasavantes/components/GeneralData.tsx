import { Box, Grid, Paper } from '@mui/material';
import { Fragment } from 'react';
import { QUARTER_PERIOD_FULL } from '../../../../commons/States';
import { useNavigate } from 'react-router-dom';
import AutocompleteConChips from '../../../../components/layout/SelectConChips';
import Input from '../../../../components/Input/Input';
import Loading from '../../../../components/Loading';

function GeneralData(props: any) {
    const navigate = useNavigate();
    const {
        data,
        loadingData,
        handleChange,
        fetchingData,
        getRateCode,
        rateCodes,
        loadingRateCodes,
        billing
    } = props;
    return (
        <Box>
            <Box
                sx={{
                    display: 'inline-flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center'
                }}
            >
                <p>Información general de viaje</p>
                {!loadingData && !fetchingData && data && (
                    <p
                        className="text-link"
                        onClick={() => navigate(`/agp/patentes/navi/${data?.id}/detalle`)}
                    >
                        Ver solicitud completa
                    </p>
                )}
            </Box>
            <Paper sx={{ border: '1px solid #D9D9D9', borderRadius: '12px' }}>
                {(loadingData || fetchingData) && !data ? (
                    <Loading size="medium" />
                ) : (
                    <Grid container spacing={2} p={4} sx={{ fontSize: 16 }}>
                        <Grid item xs={12} mt={2} mb={2}>
                            Trimestre:{' '}
                            <b>
                                {QUARTER_PERIOD_FULL[data?.ultimoPeriodo?.trimestre]}{' '}
                                {data?.ultimoPeriodo?.anio}
                            </b>
                        </Grid>
                        <Grid item xs={12}>
                            Terminal - Muelle
                        </Grid>
                        {data?.movimientos?.map((item: any) => (
                            <Fragment key={item?.id}>
                                <Grid item xs={12}>
                                    <b>
                                        {item?.muelle?.terminal?.nombre} - {item?.muelle?.nombre}
                                    </b>
                                </Grid>
                            </Fragment>
                        ))}
                        <Grid item xs={12} sm={6}>
                            <AutocompleteConChips
                                value={billing?.idsCodigoTarifa || []}
                                setValue={(value: any) =>
                                    handleChange({
                                        target: {
                                            name: 'idsCodigoTarifa',
                                            value: value
                                        }
                                    })
                                }
                                label="Código de tarifas"
                                width="100%"
                                options={rateCodes || []}
                                name="idsCodigoTarifa"
                                size="small"
                                limitTags={3}
                                loading={loadingRateCodes}
                                templateLabel={(option: any) => getRateCode(option)}
                                readOnly={data?.estado === 'liquidado'}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Input
                                label="Nota de patente"
                                value={data?.nota || ''}
                                readOnly
                                size="small"
                            />
                        </Grid>
                    </Grid>
                )}
            </Paper>
        </Box>
    );
}

export default GeneralData;
