import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Chip, CircularProgress } from '@mui/material';

export default function AutocompleteConChips(props: any) {
    const {
        value,
        setValue,
        options = [],
        width = false,
        label,
        placeholder,
        size = 'medium',
        name = '',
        loading,
        required = false,
        templateLabel,
        limitTags,
        readOnly = false,
        disabled = false
    } = props;
    return (
        <Autocomplete
            multiple
            loading={loading}
            size={size}
            limitTags={limitTags || 3}
            id="multiple-limit-tags"
            value={value}
            onChange={(event, newValue) => {
                setValue([...newValue]);
            }}
            noOptionsText="Sin opciones"
            options={options}
            disabled={disabled}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            getOptionLabel={(option: any) => {
                return templateLabel ? templateLabel(option) : option?.nombre;
            }}
            renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                    <Chip
                        size={size}
                        label={templateLabel ? templateLabel(option) : option?.nombre}
                        {...getTagProps({ index })}
                        key={index}
                    />
                ))
            }
            readOnly={readOnly}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    name={name}
                    placeholder={placeholder}
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
