import { Grid } from '@mui/material';
import { INTEGERS_UNIT } from '../../../constants/regex';
import { RAILWAY_STATE_OPTIONS } from '../../../commons/States';
import { selectCurrentUser } from '../../../features/auth/authSlice';
import { useAppSelector } from '../../../hooks/reduxHooks';
import AutocompleteComponent from '../../../components/layout/Autocomplete';
import DatePickerComponent from '../../../components/layout/DatePicker';
import Input from '../../../components/Input/Input';
import SelectComponent from '../../../components/SelectComponent/SelectComponent';

function Filters(props: any) {
    const {
        extraFilters,
        handleChangeExtraFilters,
        parrillas,
        loadingParrillas,
        agenciasFerroviarias,
        loadingAgencies
    } = props;

    const user = useAppSelector(selectCurrentUser);
    const isAgp = user?.empresa?.id === 1;

    return (
        <>
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
                    onChange={(e: string) => {
                        const date = new Date(e);
                        date.setHours(23, 59, 59);
                        handleChangeExtraFilters({
                            target: { name: 'fechaHasta', value: date }
                        });
                    }}
                    size="small"
                    required={!!extraFilters?.fechaDesde}
                    disabled={!extraFilters?.fechaDesde}
                />
            </Grid>
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
            <Grid item xs={6} sm={4} lg={2}>
                <SelectComponent
                    label="Estado"
                    value={extraFilters?.estados || ''}
                    name="estados"
                    data={RAILWAY_STATE_OPTIONS}
                    onChange={handleChangeExtraFilters}
                    itemValue="id"
                    size="small"
                />
            </Grid>
            <Grid item xs={6} sm={4} lg={2}>
                <SelectComponent
                    label="Parrilla"
                    value={extraFilters?.idParrilla || ''}
                    name="idParrilla"
                    loading={loadingParrillas}
                    data={parrillas}
                    onChange={handleChangeExtraFilters}
                    itemValue="id"
                    size="small"
                />
            </Grid>
            <Grid item xs={6} sm={4} lg={2}>
                <Input
                    label="Cartas de Porte Asociadas"
                    size="small"
                    name="idCartaPorte"
                    value={extraFilters?.idCartaPorte || ''}
                    onChange={(event: any) => {
                        let value = event.target.value;
                        if ((INTEGERS_UNIT.test(value) || value === '') && value?.length < 9) {
                            handleChangeExtraFilters(event);
                        }
                    }}
                    clearable
                />
            </Grid>
        </>
    );
}

export default Filters;
