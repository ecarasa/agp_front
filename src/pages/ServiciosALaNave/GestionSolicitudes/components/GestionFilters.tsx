import { Grid } from '@mui/material';
import { SERVICIOS_NAVE_STATES } from '../../../../commons/States';
import AutocompleteComponent from '../../../../components/layout/Autocomplete';
import SelectComponent from '../../../../components/SelectComponent/SelectComponent';

function GestionFilters(props: any) {
    const {
        extraFilters,
        handleChangeExtraFilters,
        services,
        loadingServices,
        gerencias,
        loadingManagements,
        fetchingManagements
    } = props;

    return (
        <>
            <Grid item xs={6} sm={4} lg={2}>
                <AutocompleteComponent
                    value={extraFilters?.idServicio}
                    onChange={(value: any) => {
                        handleChangeExtraFilters({
                            target: {
                                name: 'idServicio',
                                value: value
                            }
                        });
                    }}
                    options={services || []}
                    size="small"
                    name="activo"
                    label="Servicio"
                    loading={loadingServices}
                />
            </Grid>
            <Grid item xs={6} sm={4} lg={2}>
                <AutocompleteComponent
                    value={extraFilters?.idGerencia}
                    onChange={(value: any) => {
                        handleChangeExtraFilters({
                            target: {
                                name: 'idGerencia',
                                value: value
                            }
                        });
                    }}
                    options={gerencias || []}
                    size="small"
                    name="idGerencia"
                    label="Gerencia"
                    loading={loadingManagements || fetchingManagements}
                />
            </Grid>
            <Grid item xs={6} sm={4} lg={2}>
                <SelectComponent
                    label="Estado"
                    value={extraFilters?.idEstado || ''}
                    name="idEstado"
                    data={SERVICIOS_NAVE_STATES}
                    onChange={handleChangeExtraFilters}
                    itemValue="id"
                    itemContent="value"
                    size="small"
                />
            </Grid>
        </>
    );
}

export default GestionFilters;
