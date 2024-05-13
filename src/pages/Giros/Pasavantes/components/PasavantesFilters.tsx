import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import AutocompleteComponent from '../../../../components/layout/Autocomplete';

const states: any = [
    { id: 1, nombre: 'Liquidados', value: 'liquidado' },
    { id: 2, nombre: 'Pendientes', value: 'pendiente_liquidar' }
];

const orderParams: any = [
    { id: 2, nombre: 'Fecha Entrada Vanguardia' },
    { id: 4, nombre: 'Fecha Salida Vanguardia' }
];
function PasavantesFilters(props: any) {
    const { filters, setFilters, assemblers, loadingAssemblers, agencies, loadingAgencies } = props;

    return (
        <>
            <Grid item xs={6} sm={4} md={2}>
                <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id="estado-giro">Filtrar por estado</InputLabel>
                    <Select
                        labelId="estado-giro"
                        label="Filtrar por estado"
                        name="estadoGiro"
                        value={filters?.estadoGiro || 'pasavante'}
                        onChange={(e: any) =>
                            setFilters({ ...filters, estadoGiro: e.target.value || 'pasavante' })
                        }
                    >
                        <MenuItem value={'pasavante'}>Todos</MenuItem>
                        {states?.map((option: any) => (
                            <MenuItem key={option.id} value={option.value}>
                                {option.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id="ordenar-por">Ordenar por</InputLabel>
                    <Select
                        labelId="ordenar-por"
                        label="Ordenar por"
                        name="idOrderBy"
                        value={filters?.idOrderBy || ''}
                        onChange={(e: any) => {
                            if (!e.target.value) {
                                let auxFilters = { ...filters };
                                delete auxFilters['idOrderBy'];
                                setFilters(auxFilters);
                            } else setFilters({ ...filters, idOrderBy: e.target.value });
                        }}
                    >
                        <MenuItem value={''}>Ordenar por</MenuItem>
                        {orderParams?.map((option: any) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <AutocompleteComponent
                    value={assemblers?.data?.armadores?.find(
                        (i: any) => i.id === filters?.idArmador
                    )}
                    onChange={(e: any) => {
                        if (!e) {
                            let auxFilters = { ...filters };
                            delete auxFilters['idArmador'];
                            setFilters(auxFilters);
                        } else setFilters({ ...filters, idArmador: e?.id });
                    }}
                    name="nombre_armador"
                    label="Armador"
                    size="small"
                    options={assemblers?.data?.armadores || []}
                    loading={loadingAssemblers}
                    type="search"
                    hiddeArrow
                    required
                />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <AutocompleteComponent
                    value={agencies?.find((i: any) => i.id === filters?.idAgenciaMaritima || '')}
                    onChange={(e: any) => {
                        if (!e) {
                            let auxFilters = { ...filters };
                            delete auxFilters['idAgenciaMaritima'];
                            setFilters(auxFilters);
                        } else setFilters({ ...filters, idAgenciaMaritima: e.id });
                    }}
                    options={agencies || []}
                    loading={loadingAgencies}
                    size="small"
                    name="idAgenciaMaritima"
                    label="Agencia marítima"
                />
            </Grid>
        </>
    );
}

export default PasavantesFilters;
