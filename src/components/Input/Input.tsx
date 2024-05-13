import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

interface TypeProps {
    type?: string;
    label?: string;
    required?: boolean;
    onChange?: any;
    name?: string;
    value?: any;
    disabled?: boolean;
    readOnly?: boolean;
    errors?: any;
    size?: 'small' | 'medium';
    width?: string;
    clearable?: boolean;
    autoComplete?: 'on' | 'off';
    placeholder?: string | undefined;
    endIcon?: any;
    onKeyDown?: any;
    onBlur?: any;
    borderColor?: any;
}

const Input = ({
    type = 'text',
    label = '',
    required = false,
    onChange,
    name,
    value,
    disabled,
    readOnly,
    errors = null,
    size = 'medium',
    width,
    clearable = false,
    autoComplete = 'off',
    placeholder = undefined,
    endIcon,
    onKeyDown,
    onBlur,
    borderColor = null
}: TypeProps) => {
    return (
        <TextField
            className="input-textfield"
            aria-readonly
            disabled={disabled}
            type={type}
            style={{ width: width }}
            label={label}
            fullWidth
            value={value}
            name={name}
            sx={
                (borderColor && {
                    '& fieldset': {
                        borderColor: `${borderColor} !important`,
                        borderWidth: '1px !important'
                    },
                    '& label': {
                        color: '#000 !important'
                    }
                }) ||
                {}
            }
            helperText={errors && name && errors[name] ? errors[name] || 'Campo incorrecto' : ''}
            error={errors && name && !!errors[name]}
            size={size}
            placeholder={placeholder || undefined}
            required={required}
            onBlur={onBlur}
            onChange={(e: any) => {
                if (!onChange) return;
                onChange(e);
            }}
            InputProps={{
                onKeyDown: (e) => {
                    if (onKeyDown) {
                        if (e.key === 'Enter') onKeyDown();
                    } else return null;
                },
                readOnly: readOnly,
                autoComplete: autoComplete,
                endAdornment:
                    type === 'search' ? (
                        <InputAdornment position="end">
                            <IconButton aria-label="toggle password visibility" edge="end">
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ) : clearable && value ? (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={(e: any) => {
                                    if (!onChange) return;
                                    onChange({ target: { value: null, name: name } });
                                }}
                                edge="end"
                            >
                                <HighlightOffIcon color="primary" />
                            </IconButton>
                        </InputAdornment>
                    ) : endIcon ? (
                        <InputAdornment position="end">{endIcon}</InputAdornment>
                    ) : null
            }}
        />
    );
};

export default Input;
