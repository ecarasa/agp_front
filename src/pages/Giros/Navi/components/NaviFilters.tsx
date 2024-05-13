import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';

function NaviFilters(props: any) {
    const { filters, setFilters } = props;

    const naviStates: any = [
        { id: 1, nombre: 'Todos', value: 'todos_navi' },
        { id: 2, nombre: 'Próximo', value: 'proximo' },
        { id: 3, nombre: 'Operando', value: 'operando' },
        { id: 4, nombre: 'Revisión', value: 'revision' }
    ];

    const orderParams: any = [
        { id: 1, nombre: 'Fecha Carga' },
        // { id: 2, nombre: 'Fecha Ingreso RADA' },
        { id: 3, nombre: 'Fecha Entrada Vanguardia' },
        { id: 4, nombre: 'Fecha Salida Vanguardia' }
    ];

    return (
        <>
            <Grid item xs={2}>
                <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id="filtrar-por">Filtrar por</InputLabel>
                    <Select
                        labelId="filtrar-por"
                        label="Filtrar por"
                        name="estadoGiro"
                        value={filters?.estadoGiro || ''}
                        onChange={(e: any) =>
                            setFilters({ ...filters, estadoGiro: e.target.value || 'navi' })
                        }
                    >
                        {naviStates?.map((option: any) => (
                            <MenuItem key={option.id} value={option.value}>
                                {option.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={2}>
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
        </>
    );
}

export default NaviFilters;
