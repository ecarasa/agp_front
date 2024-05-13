import { Arrow360 } from '../../../../components/Icons';
import { Box, Grid, Paper } from '@mui/material';
import { getDateTime } from '../../../../utils/common';
import { useNavigate } from 'react-router-dom';
import AutocompleteConChips from '../../../../components/layout/SelectConChips';
import Input from '../../../../components/Input/Input';

function PasavanteTripDetails(props: any) {
    const { data, billing, handleChange, rateCodes, loadingRateCodes, getRateCode } = props;
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                '& .MuiPaper-root': {
                    marginBottom: '16px',
                    border: '1px solid #D9D9D9',
                    borderRadius: '12px'
                }
            }}
        >
            <Box sx={{ display: 'inline-flex', justifyContent: 'space-between', width: '100%' }}>
                <p>Detalle de viaje</p>

                <p
                    className="text-link"
                    onClick={() => navigate(`/agp/giros/navi/${data?.id}/detalle`)}
                >
                    Ver solicitud completa
                </p>
            </Box>
            {data?.movimientos?.map((item: any, index: number) => (
                <Paper key={item?.id}>
                    <Grid
                        container
                        spacing={2}
                        p={2}
                        mb={2}
                        sx={{
                            '& .grid-movements': {
                                textAlign: 'center',
                                '& p:first-of-type': {
                                    fontWeight: 800
                                }
                            },
                            fontSize: 16
                        }}
                    >
                        <Grid
                            item
                            xs={12}
                            sx={{ gap: '5px', display: 'flex', alignItems: 'center' }}
                        >
                            <Arrow360 />
                            Movimiento {index + 1}
                        </Grid>

                        <Grid item xs={12} md={5} xl={5}>
                            <Input
                                readOnly
                                label="Terminal"
                                size="small"
                                value={item?.terminal?.nombre}
                            />
                        </Grid>
                        <Grid item xs={9} md={5} xl={5}>
                            <Input
                                readOnly
                                label="Muelle"
                                size="small"
                                value={item?.muelleOperacion?.nombre}
                            />
                        </Grid>
                        <Grid item xs={3} md={2} xl={2}>
                            <Input
                                label="Andana"
                                size="small"
                                readOnly
                                value={item?.andanaOperacion}
                            />
                        </Grid>
                        <Grid item xs={12} xl={8}>
                            <AutocompleteConChips
                                value={billing?.rateCodes?.[item?.id] || []}
                                setValue={(e: any) =>
                                    handleChange({
                                        target: {
                                            name: 'rateCodes',
                                            value: {
                                                ...billing?.rateCodes,
                                                [item?.id]: e
                                            }
                                        }
                                    })
                                }
                                label="Código de tarifas"
                                width="100%"
                                placeholder=""
                                options={rateCodes || []}
                                name="rateCodes"
                                size="small"
                                limitTags={2}
                                loading={loadingRateCodes}
                                templateLabel={(option: any) => getRateCode(option)}
                                readOnly={data?.estado === 'liquidado'}
                            />
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} xl={2}>
                            <Input
                                label="Fecha de Inicio"
                                size="small"
                                readOnly
                                value={getDateTime(item?.fechaIngreso) || ''}
                            />
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} xl={2}>
                            <Input
                                label="Fecha de Fin"
                                size="small"
                                readOnly
                                value={getDateTime(item?.fechaEgreso) || ''}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            ))}
        </Box>
    );
}

export default PasavanteTripDetails;
