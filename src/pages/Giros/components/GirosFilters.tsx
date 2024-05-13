import { FormControl, Grid, InputLabel, MenuItem, Select, capitalize } from '@mui/material';
import { GIROS_STATES } from '../../../commons/States';
import { selectCurrentUser } from '../../../features/auth/authSlice';
import { useAppSelector } from '../../../hooks/reduxHooks';
import AutocompleteComponent from '../../../components/layout/Autocomplete';
import DatePickerComponent from '../../../components/layout/DatePicker';
import Input from '../../../components/Input/Input';

function GirosFilters(props: any) {
    const {
        extraFilters,
        handleChangeExtraFilters,
        shipParametrics,
        agencies,
        loadingAgencies,
        loadingShipParametrics
    } = props;
    const user = useAppSelector(selectCurrentUser);

    return (
        <>
            {!user?.empresa?.tienePerfilAgenciaMaritima && (
                <Grid item xs={6} sm={4} md={2}>
                    <AutocompleteComponent
                        value={extraFilters?.idAgenciaMaritima || ''}
                        onChange={(value: any) => {
                            handleChangeExtraFilters({
                                target: {
                                    name: 'idAgenciaMaritima',
                                    value: value,
                                    type: 'autocomplete'
                                }
                            });
                        }}
                        options={agencies || []}
                        loading={loadingAgencies}
                        size="small"
                        name="idAgenciaMaritima"
                        label="Agencia marítima"
                    />
                </Grid>
            )}
            <Grid item xs={6} sm={4} md={2}>
                <Input
                    size="small"
                    name="nombreBuque"
                    label="Nombre de buque"
                    value={extraFilters?.nombreBuque || ''}
                    onChange={handleChangeExtraFilters}
                />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <DatePickerComponent
                    width="100%"
                    value={extraFilters?.fechaDesde || null}
                    label="Fecha carga desde"
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
                    width="100%"
                    value={extraFilters?.fechaHasta || null}
                    label="Fecha carga hasta"
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

            <Grid item xs={6} sm={4} md={2}>
                <AutocompleteComponent
                    value={extraFilters?.idTipoEmbarcacion}
                    size="small"
                    name="idTipoEmbarcacion"
                    label="Tipo de buque"
                    onChange={(value: any) => {
                        handleChangeExtraFilters({
                            target: {
                                name: 'idTipoEmbarcacion',
                                value: value,
                                type: 'autocomplete'
                            }
                        });
                    }}
                    options={shipParametrics?.tiposBuque || []}
                    loading={loadingShipParametrics}
                />
            </Grid>

            <Grid item xs={6} sm={4} md={2}>
                <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id="estado-giro">Estado de giro</InputLabel>
                    <Select
                        labelId="estado-giro"
                        label="Estado de giro"
                        name="estadoGiro"
                        value={extraFilters?.estadoGiro || ''}
                        onChange={handleChangeExtraFilters}
                    >
                        <MenuItem value={''}>Seleccionar</MenuItem>
                        {Object.entries(GIROS_STATES).map(([key, value]: any) => (
                            <MenuItem key={key} value={value}>
                                {capitalize(value)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </>
    );
}

export default GirosFilters;
