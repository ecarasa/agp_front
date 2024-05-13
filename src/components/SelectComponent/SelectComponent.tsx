import {
    CircularProgress,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material';

interface SelectProps {
    label: string;
    value: any;
    onChange: (event: any) => any;
    loading?: boolean;
    fetching?: boolean;
    name: string | undefined;
    data: any;
    itemValue?: ItemProps;
    itemContent?: ItemProps;
    size?: 'small' | 'medium';
    required?: boolean;
}

type ItemProps = 'id' | 'nombre' | 'value';

function SelectComponent(props: SelectProps) {
    const {
        label,
        value,
        onChange,
        loading,
        fetching,
        name,
        data = [],
        itemValue,
        itemContent,
        size,
        required = false
    } = props;
    return (
        <FormControl fullWidth variant="outlined" size={size || 'medium'} required={required}>
            <InputLabel htmlFor={label}>{label}</InputLabel>
            <Select
                labelId={label}
                label={label}
                name={name}
                value={value || ''}
                onChange={onChange}
                endAdornment={
                    loading || fetching ? (
                        <InputAdornment sx={{ marginRight: '20px' }} position="end">
                            <CircularProgress size={20} />
                        </InputAdornment>
                    ) : null
                }
            >
                <MenuItem key={-1} value={''}>
                    Seleccionar
                </MenuItem>
                {data?.map((item: any) => (
                    <MenuItem key={item?.id} value={itemValue ? item[itemValue] : item}>
                        {itemContent ? item[itemContent] : item?.nombre}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default SelectComponent;
