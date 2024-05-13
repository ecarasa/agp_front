import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

interface AutoCompleteProps {
    value?: any;
    onChange?: any;
    label?: string;
    options?: any;
    fullWidth?: boolean;
    size?: string;
    loading?: boolean;
    type?: string;
    hiddeArrow?: boolean;
    onMouseDownCapture?: any;
    disabled?: boolean;
    defaultValue?: any;
    handleInputChange?: any;
    readOnly?: boolean;
    required?: boolean;
    onInputChange?: any;
    templateLabel?: any;
    width?: any;
    name: string;
    errors?: any;
    disableClearable?: any;
    warning?: boolean;
}
export default function AutocompleteComponent(props: any) {
    const {
        value,
        onChange,
        label,
        options,
        fullWidth = false,
        size = 'medium',
        loading,
        type,
        hiddeArrow = false,
        onMouseDownCapture,
        disabled = false,
        handleInputChange,
        readOnly = false,
        required = false,
        onInputChange,
        templateLabel,
        width = null,
        name,
        errors,
        disableClearable,
        warning
    }: AutoCompleteProps = props;

    return (
        <Autocomplete
            clearIcon={<HighlightOffIcon color="primary" />}
            value={value || null}
            disabled={disabled}
            disableClearable={disableClearable}
            options={options || []}
            loading={loading}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            getOptionLabel={(option: any) => {
                return templateLabel ? templateLabel(option) : option?.nombre;
            }}
            onChange={(_: any, value: any) => {
                onChange(value);
            }}
            noOptionsText="Sin opciones"
            onMouseDownCapture={onMouseDownCapture}
            freeSolo={hiddeArrow}
            onInputChange={(_, value) => {
                if (onInputChange && value !== 'undefined') return onInputChange(value);
                if (!handleInputChange) return;
                handleInputChange(value);
            }}
            readOnly={readOnly}
            fullWidth={fullWidth}
            renderOption={(props, option) => {
                return templateLabel ? (
                    <li {...props} key={option.id}>
                        {templateLabel(option)}
                    </li>
                ) : (
                    <li {...props} key={option.id}>
                        {option.nombre}
                    </li>
                );
            }}
            sx={{ width: { width } }}
            renderInput={(params: any) => (
                <TextField
                    {...params}
                    id={params.id}
                    label={label}
                    size={size}
                    name={name}
                    sx={
                        (warning && {
                            '& fieldset': {
                                borderColor: '#FABC00 !important',
                                borderWidth: '2px !important'
                            },
                            '& label': {
                                color: '#FABC00 !important'
                            }
                        }) ||
                        {}
                    }
                    helperText={errors && name && errors[name]}
                    error={!!errors && name && !!errors[name]}
                    required={required}
                    InputProps={{
                        ...params.InputProps,
                        onKeyDown: (e) => {
                            if (e.key === 'Enter') {
                                e.stopPropagation();
                            }
                        },
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}

                                {type === 'search' ? (
                                    <>
                                        {params.InputProps.endAdornment}
                                        {!params.inputProps.value && (
                                            <SearchIcon color="primary" fontSize="medium" />
                                        )}
                                    </>
                                ) : (
                                    params.InputProps.endAdornment
                                )}
                            </>
                        )
                    }}
                />
            )}
        />
    );
}
