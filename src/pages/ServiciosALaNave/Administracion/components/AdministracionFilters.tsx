import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { STATE_OPTIONS_FOR_FILTERS } from '../../../../commons/States';

function AdministracionFilters(props: any) {
    const { filters, setFilters } = props;

    return (
        <Grid item xs={12}>
            <FormControl variant="outlined" size="small" sx={{ width: '170px' }}>
                <InputLabel id="estado">Filtrar por estado</InputLabel>
                <Select
                    labelId="estado"
                    label="Filtrar por estado"
                    name="estado"
                    value={filters?.estado || ''}
                    onChange={(e: any) => {
                        if (e.target.value) {
                            setFilters({
                                ...filters,
                                estado: e.target.value
                            });
                        } else {
                            let auxObject = { ...filters };
                            delete auxObject['estado'];
                            setFilters(auxObject);
                        }
                    }}
                >
                    <MenuItem value={''}>Todos</MenuItem>
                    {STATE_OPTIONS_FOR_FILTERS?.map((option: any) => (
                        <MenuItem key={option.id} value={option.nombre.toLowerCase()}>
                            {option.nombre}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    );
}

export default AdministracionFilters;
