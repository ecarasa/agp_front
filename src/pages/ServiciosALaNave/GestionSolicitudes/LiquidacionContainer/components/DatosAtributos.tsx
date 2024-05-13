import { Box, Divider, Grid, Paper } from '@mui/material';
import { Fragment } from 'react';
import AutocompleteConChips from '../../../../../components/layout/SelectConChips';
import Input from '../../../../../components/Input/Input';

function DatosAtributos(props: any) {
    const { data, billing, rateCodes, loadingRateCodes, handleChange } = props;

    return (
        <Box>
            <p>Datos de Atributos</p>
            <Paper sx={{ border: '1px solid #D9D9D9', borderRadius: '12px' }}>
                <Grid container spacing={2} p={4} sx={{ fontSize: 16 }} alignItems="center">
                    {data?.detalle?.map((item: any) => (
                        <Fragment key={item?.atributo?.id}>
                            <Grid item xs={6} sm={4}>
                                {item?.atributo?.nombre}
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <b>{item?.provisto || ''}</b>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Input
                                    label="Nota de aprovisionamiento"
                                    value={item?.nota || ''}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ borderWidth: '1.5px' }} />
                            </Grid>
                        </Fragment>
                    ))}
                    <Grid item xs={12}>
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
                            templateLabel={(option: any) =>
                                `${option?.codigo} - ${option?.descripcion}`
                            }
                            readOnly={data?.estado === 'LIQUIDADO'}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}

export default DatosAtributos;
