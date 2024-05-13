import { Grid } from '@mui/material';
import DatePickerComponent from '../../../../../components/layout/DatePicker';

function ShipHistoryFilters(props: any) {
    const { extraFilters, handleChangeExtraFilters } = props;
    return (
        <>
            <Grid item xs={6} sm={4} md={2}>
                <DatePickerComponent
                    value={extraFilters?.fechaDesde || null}
                    label="Fecha desde"
                    onChange={(e: string) =>
                        handleChangeExtraFilters({
                            target: { name: 'fechaDesde', value: e }
                        })
                    }
                    size="small"
                />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <DatePickerComponent
                    value={extraFilters?.fechaHasta || null}
                    label="Fecha hasta"
                    onChange={(e: string) => {
                        const date = new Date(e);
                        date.setHours(23, 59, 59);
                        handleChangeExtraFilters({
                            target: { name: 'fechaHasta', value: date }
                        });
                    }}
                    size="small"
                />
            </Grid>
        </>
    );
}

export default ShipHistoryFilters;
