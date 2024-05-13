import { Grid } from '@mui/material';
import AutocompleteComponent from '../../../components/layout/Autocomplete';
import Input from '../../../components/Input/Input';

function UsersFilters(props: any) {
    const { optionsSelect1, extraFilters, handleChangeExtraFilters } = props;
    const options = [
        { id: 1, nombre: 'Activo', value: true },
        { id: 2, nombre: 'Inactivo', value: false },
        { id: 3, nombre: 'Bloqueado', value: true }
    ];
    return (
        <>
            <Grid item xs={6} sm={4} md={2}>
                <Input
                    label="Nombre y Apellido"
                    size="small"
                    name="nombreUsuario"
                    onChange={handleChangeExtraFilters}
                    value={extraFilters?.nombreUsuario || ''}
                    clearable
                />
            </Grid>

            <Grid item xs={6} sm={4} md={2}>
                <AutocompleteComponent
                    value={optionsSelect1?.find(
                        (i: any) => i?.nombre === extraFilters?.nombreEmpresa?.nombre
                    )}
                    options={optionsSelect1}
                    size="small"
                    name="nombreEmpresa"
                    label="Empresa"
                    onChange={(value: any) => {
                        handleChangeExtraFilters({
                            target: {
                                name: 'nombreEmpresa',
                                value: value
                            }
                        });
                    }}
                />
            </Grid>

            <Grid item xs={6} sm={4} md={2}>
                <AutocompleteComponent
                    value={extraFilters?.userState}
                    options={options}
                    size="small"
                    name="userState"
                    label="Estado"
                    onChange={(value: any) => {
                        handleChangeExtraFilters({
                            target: {
                                name: 'userState',
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
