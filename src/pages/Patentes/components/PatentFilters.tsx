import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    capitalize
} from '@mui/material';
import { PATENT_STATES, QUARTER_PERIOD_FULL } from '../../../commons/States';
import { yearOptions } from '../PatentSave/hooks/usePatentSave';

const PatentFilters = (props: any) => {
    const { extraFilters, handleChangeExtraFilters } = props;
    return (
        <>
            <Grid item xs={6} sm={4} lg={2}>
                <FormControl fullWidth variant="outlined" required size="small">
                    <InputLabel htmlFor="Año">Año</InputLabel>
                    <Select
                        labelId="Año"
                        label="Año"
                        name="anio"
                        value={extraFilters?.anio || ''}
                        onChange={handleChangeExtraFilters}
                    >
                        <MenuItem key={-1} value={''}>
                            Seleccionar
                        </MenuItem>
                        {yearOptions()?.map((item: any) => (
                            <MenuItem key={item?.id} value={item.value}>
                                {item?.value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={6} sm={4} lg={2}>
                <FormControl
                    fullWidth
                    variant="outlined"
                    size="small"
                    required={!!extraFilters?.anio}
                    disabled={!extraFilters?.anio}
                >
                    <InputLabel id="trimestre">Trimestre</InputLabel>
                    <Select
                        labelId="trimestre"
                        label="Trimestre"
                        name="trimestre"
                        value={extraFilters?.trimestre || ''}
                        onChange={handleChangeExtraFilters}
                    >
                        <MenuItem value={''}>Seleccionar</MenuItem>
                        {Object.entries(QUARTER_PERIOD_FULL).map(([key, value]: any) => (
                            <MenuItem key={key} value={key}>
                                {capitalize(value)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            {false && (
                <Grid item xs={6} sm={4} lg={2}>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id="estado-patente">Estado de patente</InputLabel>
                        <Select
                            labelId="estado-patente"
                            label="Estado de patente"
                            name="estadoPatente"
                            value={extraFilters?.estadoPatente || ''}
                            onChange={handleChangeExtraFilters}
                        >
                            <MenuItem value={''}>Seleccionar</MenuItem>
                            {Object.entries(PATENT_STATES).map(([key, value]: any) => (
                                <MenuItem key={key} value={value}>
                                    {capitalize(value)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            )}
            <Grid item xs={6} sm={4} lg={2}>
                <Box className="MuiInputBase-root">
                    <FormControlLabel
                        sx={{
                            width: 'auto',
                            marginLeft: '5px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 'calc(100% - 16px)',
                            display: 'block',
                            color: 'rgba(0, 0, 0, 0.6)'
                        }}
                        control={
                            <Checkbox
                                name="baja"
                                color="default"
                                checked={extraFilters?.baja || false}
                                onChange={handleChangeExtraFilters}
                            />
                        }
                        label="Pedido de baja"
                    />
                </Box>
            </Grid>
        </>
    );
};

export default PatentFilters;
