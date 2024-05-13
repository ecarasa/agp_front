import _ from 'lodash';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import VirtualizedAutocomplete from '../../../../../components/VirtualizedAutocomplete';
import { useIsMobile } from '../../../../../hooks/useIsMobile';

function ItineraryDataForm(props: any) {
    const {
        data,
        railwayCompanies,
        companies,
        loadingCompanies,
        handleChangeData,
        errors,
        cities,
        fetchingWaybill,
        loadingWaybill,
        loadingCities
    } = props;
    const { isMobile } = useIsMobile();
    return (
        <>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" required>
                    <InputLabel htmlFor="idFerrocarril">Ferrocarril</InputLabel>
                    <Select
                        labelId="idFerrocarril"
                        label="Ferrocarril"
                        name="idFerrocarril"
                        value={data?.idFerrocarril || ''}
                        onChange={handleChangeData}
                        error={!_.isEmpty(errors) && !!errors['idFerrocarril']}
                    >
                        <MenuItem key={-1} value={''}>
                            Seleccionar
                        </MenuItem>
                        {railwayCompanies?.map((item: any) => (
                            <MenuItem key={item?.id} value={item.id}>
                                {item?.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            {!isMobile && <Grid item xs={12} sm={6} />}
            <Grid item xs={12} sm={6}>
                <VirtualizedAutocomplete
                    value={data?.idOrigen || ''}
                    templateLabel={(option: any) => `${option.id} - ${option.nombre}`}
                    onChange={(value: any) =>
                        handleChangeData({
                            target: {
                                name: 'object',
                                value: {
                                    idOrigen: value,
                                    idLugarCarga: value?.ciudad
                                }
                            }
                        })
                    }
                    options={companies || []}
                    label="Origen"
                    name="idOrigen"
                    required
                    disabled={loadingCities}
                    loading={loadingCompanies || fetchingWaybill || loadingWaybill}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <VirtualizedAutocomplete
                    value={data?.idDestino || ''}
                    templateLabel={(option: any) => `${option.id} - ${option.nombre}`}
                    onChange={(value: any) =>
                        handleChangeData({
                            target: {
                                name: 'object',
                                value: {
                                    idDestino: value,
                                    idLugarDescarga: value?.ciudad
                                }
                            }
                        })
                    }
                    options={companies || []}
                    label="Destino"
                    name="idDestino"
                    required
                    disabled={loadingCities}
                    loading={loadingCompanies || fetchingWaybill || loadingWaybill}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <VirtualizedAutocomplete
                    value={data?.idLugarCarga || ''}
                    templateLabel={(option: any) =>
                        `${option.id} - ${option.nombre} - ${option?.pais?.nombre}`
                    }
                    onChange={(value: any) =>
                        handleChangeData({
                            target: {
                                name: 'idLugarCarga',
                                value: value
                            }
                        })
                    }
                    options={cities || []}
                    loading={fetchingWaybill || loadingWaybill}
                    required
                    label="Lugar de Carga"
                    name="idLugarCarga"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <VirtualizedAutocomplete
                    value={data?.idLugarDescarga || ''}
                    templateLabel={(option: any) =>
                        `${option.id} - ${option.nombre} - ${option?.pais?.nombre}`
                    }
                    onChange={(value: any) =>
                        handleChangeData({
                            target: {
                                name: 'idLugarDescarga',
                                value: value
                            }
                        })
                    }
                    options={cities || []}
                    loading={fetchingWaybill || loadingWaybill}
                    required
                    label="Lugar de Descarga"
                    name="idLugarDescarga"
                />
            </Grid>
        </>
    );
}

export default ItineraryDataForm;
