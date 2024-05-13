import 'dayjs/locale/es';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export function DatePickerComponent(props: any) {
    const {
        label = '',
        value = new Date(),
        setValue,
        disablePast = false,
        views = null,
        width = '100%',
        required = false,
        errors = null,
        name = '',
        disabled = false,
        onChange,
        size,
        helperText = null,
        disableFuture = false
    } = props;

    return (
        <Box sx={{ width: '100%' }}>
            <LocalizationProvider adapterLocale="es" dateAdapter={AdapterDayjs}>
                <DatePicker
                    label={label}
                    value={value ? dayjs(value) : null}
                    onChange={(newValue) => {
                        if (onChange) return onChange(newValue);
                        setValue(newValue);
                    }}
                    format="DD/MM/YYYY"
                    disablePast={disablePast}
                    views={views}
                    sx={{
                        width: { width }
                    }}
                    disabled={disabled}
                    slotProps={{
                        textField: {
                            name: name,
                            required: required,
                            helperText: helperText,
                            error: !!errors && !!errors[name],
                            size: size || 'medium'
                        }
                    }}
                    disableFuture={disableFuture}
                />
            </LocalizationProvider>
        </Box>
    );
}

export default DatePickerComponent;
