import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';

function Filters(props: any) {
    const { filters, setFilters, filterOptions } = props;
    return (
        <Grid item xs={2}>
            <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="muelle">Filtrar por muelle</InputLabel>
                <Select
                    labelId="muelle"
                    label="Filtrar por estado"
                    name="idMuelle"
                    value={filters?.idMuelle || ''}
                    onChange={(e: any) => {
                        if (e.target.value) {
                            setFilters({
                                ...filters,
                                idMuelle: e.target.value
                            });
                        } else {
                            let auxObject = { ...filters };
                            delete auxObject['idMuelle'];
                            setFilters(auxObject);
                        }
                    }}
                >
                    <MenuItem value={''}>Todos</MenuItem>
                    {filterOptions?.map((option: any) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.nombre}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    );
}

export default Filters;
