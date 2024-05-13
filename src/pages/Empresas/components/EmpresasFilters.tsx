import { Grid } from '@mui/material';
import { STATE_OPTIONS_FOR_FILTERS } from '../../../commons/States';
import AutocompleteComponent from '../../../components/layout/Autocomplete';
import Input from '../../../components/Input/Input';

function UsersFilters(props: any) {
    const { parametricData, extraFilters, handleChangeExtraFilters } = props;

    const perfiles = parametricData?.perfiles.map((i: any) => ({
        ...i,
        nombre: i.nombre.toLowerCase().replace(/\b\w/g, (l: any) => l.toUpperCase())
    }));

    return (
        <>
            <Grid item xs={6} sm={4} md={2}>
                <Input
                    label="Nombre Comercial"
                    size="small"
                    name="nombreComercial"
                    onChange={handleChangeExtraFilters}
                    value={extraFilters?.nombreComercial || ''}
                    clearable
                />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <Input
                    label="Identificación Fiscal"
                    size="small"
                    name="identificacionFiscal"
                    onChange={handleChangeExtraFilters}
                    value={extraFilters?.identificacionFiscal || ''}
                    clearable
                />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <AutocompleteComponent
                    value={extraFilters?.activo}
                    options={STATE_OPTIONS_FOR_FILTERS}
                    size="small"
                    name="activo"
                    label="Estado"
                    onChange={(value: any) => {
                        handleChangeExtraFilters({
                            target: {
                                name: 'activo',
                                value: value
                            }
                        });
                    }}
                />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <AutocompleteComponent
                    value={extraFilters?.perfiles || ''}
                    options={perfiles || []}
                    size="small"
                    name="perfiles"
                    label="Perfil"
                    onChange={(value: any) => {
                        handleChangeExtraFilters({
                            target: {
                                name: 'perfiles',
                                value: value
                            }
                        });
                    }}
                />
            </Grid>
        </>
    );
}

export default UsersFilters;
