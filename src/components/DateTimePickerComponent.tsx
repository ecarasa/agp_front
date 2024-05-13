import 'dayjs/locale/es';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function DateTimePickerComponent({
    sx,
    label,
    value,
    onChange,
    slotProps,
    disabled,
    disablePast,
    disableFuture
}: any) {
    return (
        <LocalizationProvider adapterLocale="es" dateAdapter={AdapterDayjs}>
            <DateTimePicker
                label={label}
                sx={sx}
                value={value || null}
                format="DD/MM/YYYY HH:mm"
                onChange={onChange}
                disabled={disabled || false}
                slotProps={slotProps}
                disableFuture={disableFuture || false}
                disablePast={disablePast || false}
            />
        </LocalizationProvider>
    );
}

export default DateTimePickerComponent;
