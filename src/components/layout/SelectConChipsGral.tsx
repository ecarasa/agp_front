import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Chip, CircularProgress } from '@mui/material';

export default function AutocompleteConChips(props: any) {
    const {
        value,
        onChange,
        options = [],
        width = false,
        label,
        placeholder,
        size = '',
        name = '',
        loading,
        defaultValue = [],
        required = false
    } = props;

    return (
        <Autocomplete
            multiple
            loading={loading}
            limitTags={3}
            id="multiple-limit-tags"
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            noOptionsText="Sin opciones"
            options={options}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            getOptionLabel={(option) => option.nombre}
            renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                    <Chip label={option.nombre} {...getTagProps({ index })} key={index} />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    name={name}
                    placeholder={placeholder}
                    size={size}
                    required={required}
                    InputProps={{
                        ...params.InputProps,
                        required: required && value?.length === 0,
                        onKeyDown: (e) => {
                            if (e.key === 'Enter') {
                                e.stopPropagation();
                            }
                        },
                        endAdornment: (
                            <>{loading ? <CircularProgress color="inherit" size={20} /> : null}</>
                        )
                    }}
                />
            )}
            sx={{ width: width }}
        />
    );
}
