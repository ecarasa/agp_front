import { Grid } from '@mui/material';
import { STATE_OPTIONS_FOR_FILTERS } from '../../../commons/States';
import AutocompleteComponent from '../../../components/layout/Autocomplete';
import Input from '../../../components/Input/Input';

function RolesFilters(props: any) {
    const { parametricData, extraFilters, handleChangeExtraFilters } = props;

    const perfiles = parametricData?.perfiles.map((i: any) => ({
        ...i,
        nombre: i.nombre.toLowerCase().replace(/\b\w/g, (l: any) => l.toUpperCase())
    }));

    return (
        <>

        </>
    );
}

export default RolesFilters;
