import { Grid } from '@mui/material';
import { selectCurrentUser } from '../../../features/auth/authSlice';
import { useAppSelector } from '../../../hooks/reduxHooks';
import AutocompleteComponent from '../../../components/layout/Autocomplete';
import DatePickerComponent from '../../../components/layout/DatePicker';
import useFilters from '../hooks/useFilters';

function CartasPorteFilters(props: any) {
    const user = useAppSelector(selectCurrentUser);
    const isAgp = user?.empresa?.id === 1;
    const { extraFilters, handleChangeExtraFilters } = props;
    const { agenciasFerroviarias, empresas, loadingAgencies, loadingEmpresas } = useFilters();

    return (
        <>
            {isAgp && (
                <Grid item xs={6} sm={4} lg={2}>
                    <AutocompleteComponent
                        value={extraFilters?.idAgenciaFerroviaria}
                        options={agenciasFerroviarias}
                        size="small"
                        name="idAgenciaFerroviaria"
                        label="Agencia Ferroviaria"
                        onChange={(value: any) => {
                            handleChangeExtraFilters({
                                target: {
                                    name: 'idAgenciaFerroviaria',
                                    value: value
                                }
                            });
                        }}
                        loading={loadingAgencies}
                    />
                </Grid>
            )}
            {false && (
                <Grid item xs={6} sm={4} lg={2}>
                    <AutocompleteComponent
                        value={extraFilters?.idFerrocarril}
                        options={[]}
                        size="small"
                        name="idFerrocarril"
                        label="Empresa Ferrocarril"
                        onChange={(value: any) => {
                            handleChangeExtraFilters({
                                target: {
                                    name: 'idFerrocarril',
                                    value: value
                                }
                            });
                        }}
                        loading={[]}
                    />
                </Grid>
            )}
            <Grid item xs={6} sm={4} lg={2}>
                <AutocompleteComponent
                    value={extraFilters?.idCliente}
                    options={empresas}
                    size="small"
                    name="idCliente"
                    label="Cliente"
                    onChange={(value: any) => {
                        handleChangeExtraFilters({
                            target: {
                                name: 'idCliente',
                                value: value
                            }
                        });
                    }}
                    loading={loadingEmpresas}
                />
            </Grid>
            <Grid item xs={6} sm={4} lg={2}>
                <AutocompleteComponent
                    value={extraFilters?.idCargador}
                    options={empresas}
                    size="small"
                    name="idCargador"
                    label="Cargador"
                    onChange={(value: any) => {
                        handleChangeExtraFilters({
                            target: {
                                name: 'idCargador',
                                value: value
                            }
                        });
                    }}
                    loading={loadingEmpresas}
                />
            </Grid>
            <Grid item xs={6} sm={4} lg={2}>
                <AutocompleteComponent
                    value={extraFilters?.idConsignatario}
                    options={empresas}
                    size="small"
                    name="idConsignatario"
                    label="Consignatario"
                    onChange={(value: any) => {
                        handleChangeExtraFilters({
                            target: {
                                name: 'idConsignatario',
                                value: value
                            }
                        });
                    }}
                    loading={loadingEmpresas}
                />
            </Grid>
            <Grid item xs={6} sm={4} lg={2}>
                <AutocompleteComponent
                    value={extraFilters?.ingreso}
                    options={[
                        { id: 1, nombre: 'Ingreso', value: true },
                        { id: 2, nombre: 'Egreso', value: false }
                    ]}
                    size="small"
                    name="ingreso"
                    label="Ingreso/Egreso"
                    onChange={(value: any) => {
                        handleChangeExtraFilters({
                            target: {
                                name: 'ingreso',
                                value: value
                            }
                        });
                    }}
                />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <DatePickerComponent
                    value={extraFilters?.fechaDesde || null}
                    label="Fecha desde"
                    onChange={(e: string) =>
                        handleChangeExtraFilters({
                            target: { name: 'fechaDesde', value: e }
                        })
                    }
                    size="small"
                />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <DatePickerComponent
                    value={extraFilters?.fechaHasta || null}
                    label="Fecha hasta"
                    required={!!extraFilters?.fechaDesde}
                    disabled={!extraFilters?.fechaDesde}
                    onChange={(e: string) => {
                        const date = new Date(e);
                        date.setHours(23, 59, 59);
                        handleChangeExtraFilters({
                            target: { name: 'fechaHasta', value: date }
                        });
                    }}
                    size="small"
                />
            </Grid>
        </>
    );
}

export default CartasPorteFilters;
