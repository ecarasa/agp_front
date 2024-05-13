import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { PASAVANTE_STATES } from '../../../../commons/States';

function Filters(props: any) {
    const { filters, setFilters } = props;

    return (
        <>
            <Grid item xs={6} sm={4} md={2}>
                <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id="estado-patente">Filtrar por estado</InputLabel>
                    <Select
                        labelId="estado-patente"
                        label="Filtrar por estado"
                        name="estadoPatente"
                        value={filters?.estadoPatente || ''}
                        onChange={(e: any) => {
                            if (!e?.target?.value && filters?.hasOwnProperty('estadoPatente')) {
                                let auxFilters = { ...filters };
                                delete auxFilters['estadoPatente'];
                                setFilters({ defaultFiltersFor: 'pasavante', ...auxFilters });
                            } else {
                                let auxFilters = { ...filters };
                                delete auxFilters['defaultFiltersFor'];
                                setFilters({ ...auxFilters, estadoPatente: e.target.value || '' });
                            }
                        }}
                    >
                        <MenuItem value={undefined}>Todos</MenuItem>
                        {PASAVANTE_STATES.map((option: any) => (
                            <MenuItem key={option.id} value={option.value}>
                                {option.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </>
    );
}

export default Filters;
