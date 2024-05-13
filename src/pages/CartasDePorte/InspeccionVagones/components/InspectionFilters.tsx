import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { INSPECTION_STATES } from '../../../../commons/States';

function InspectionFilters(props: any) {
    const { filters, handleSeachWagon } = props;

    return (
        <>
            <Grid item xs={6} sm={4} md={2}>
                <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id="estado-vagon">Filtrar por estado</InputLabel>
                    <Select
                        labelId="estado-vagon"
                        label="Filtrar por estado"
                        name="state"
                        value={filters?.state || ''}
                        onChange={handleSeachWagon}
                    >
                        <MenuItem value={undefined}>Todos</MenuItem>
                        {INSPECTION_STATES.map((option: any) => (
                            <MenuItem key={option.id} value={option.nombre}>
                                {option.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </>
    );
}

export default InspectionFilters;
