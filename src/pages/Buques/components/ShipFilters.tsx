import { Grid } from '@mui/material';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import AutocompleteComponent from '../../../components/layout/Autocomplete';
import Input from '../../../components/Input/Input';

function ShipFilters(props: any) {
    const {
        agencies,
        parametricData,
        handleSearch,
        extraFilters,
        handleChangeExtraFilters,
        countries
    } = props;
    const usuario = useSelector((state: RootState) => state.auth.user);
    const companyUser = usuario && usuario.empresa.nombre;
    const arrayEstados = parametricData?.estadosBuques.map((data: any, index: number) => {
        let newOptions = {
            id: index + 1,
            nombre:
                data.descripcion.toLowerCase().charAt(0).toUpperCase() +
                data.descripcion.slice(1).toLowerCase(),
            estado: data.estado
        };
        return newOptions;
    });

    return (
        <>
            <Grid item xs={6} sm={4} md={2}>
                <Input
                    label="IMO"
                    size="small"
                    name="imo"
                    value={extraFilters?.imo || ''}
                    onChange={handleChangeExtraFilters}
                    type="number"
                    clearable
                />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <Input
                    label="Matricula"
                    size="small"
                    name="matricula"
                    value={extraFilters?.matricula || ''}
                    onChange={handleChangeExtraFilters}
                    clearable
                />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <AutocompleteComponent
                    value={extraFilters?.pais}
                    onChange={(value: any) => {
                        handleChangeExtraFilters({
                            target: {
                                name: 'pais',
                                value: value
                            }
                        });
                    }}
                    size="small"
                    label="Bandera"
                    name="pais"
                    templateLabel={(option: any) => option.nombre}
                    options={countries || []}
                />
            </Grid>
            {companyUser === 'AGP' && (
                <Grid item xs={6} sm={4} md={2}>
                    <AutocompleteComponent
                        value={extraFilters?.nombreEmpresa}
                        onChange={(value: any) => {
                            handleChangeExtraFilters({
                                target: {
                                    name: 'nombreEmpresa',
                                    value: value
                                }
                            });
                        }}
                        options={agencies || []}
                        size="small"
                        name="nombreEmpresa"
                        label="Agencia Marítima"
                        handleSelected={handleSearch}
                    />
                </Grid>
            )}
            <Grid item xs={6} sm={4} md={2}>
                <AutocompleteComponent
                    value={extraFilters?.activo}
                    onChange={(value: any) => {
                        handleChangeExtraFilters({
                            target: {
                                name: 'activo',
                                value: value
                            }
                        });
                    }}
                    options={[
                        { id: 1, nombre: 'Activo' },
                        { id: 2, nombre: 'Inactivo' }
                    ]}
                    size="small"
                    name="activo"
                    label="Activo"
                />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <AutocompleteComponent
                    value={extraFilters?.estado}
                    onChange={(value: any) => {
                        handleChangeExtraFilters({
                            target: {
                                name: 'estado',
                                value: value
                            }
                        });
                    }}
                    options={arrayEstados}
                    size="small"
                    name="estado"
                    label="Estado"
                />
            </Grid>
        </>
    );
}

export default ShipFilters;
