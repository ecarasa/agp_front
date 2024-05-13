import { Grid } from '@mui/material';
import { INTEGERS_OR_THREE_DECIMALS, INTEGERS_UNIT } from '../../../../constants/regex';
import Input from '../../../../components/Input/Input';

function ShipDimensionsForm(props: any) {
    const { shipData, handleChange, errors } = props;
    return (
        <Grid item xs={12}>
            <Grid container spacing={3} columnSpacing={{ xs: 12, sm: 6, lg: 24 }}>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={shipData?.esloraMaxima || ''}
                        name="esloraMaxima"
                        onChange={(e: any) => {
                            let value = e.target.value;
                            if (
                                (value?.length < 16 && INTEGERS_OR_THREE_DECIMALS.test(value)) ||
                                (value === '' && !isNaN(Number(value)))
                            ) {
                                handleChange({
                                    target: {
                                        name: 'esloraMaxima',
                                        value: value
                                    }
                                });
                            }
                        }}
                        required
                        label="Eslora Máxima"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={shipData?.capacidadMaximaTEU || ''}
                        name="capacidadMaximaTEU"
                        onChange={(e: any) => {
                            let value = e.target.value;
                            if ((INTEGERS_UNIT.test(value) || value === '') && value?.length < 16) {
                                handleChange({
                                    target: {
                                        name: 'capacidadMaximaTEU',
                                        value: value
                                    }
                                });
                            }
                        }}
                        label="Capacidad Máxima TEU"
                        errors={errors}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={shipData?.manga || ''}
                        name="manga"
                        onChange={(e: any) => {
                            let value = e.target.value;
                            if (
                                (value?.length < 16 && INTEGERS_OR_THREE_DECIMALS.test(value)) ||
                                (value === '' && !isNaN(Number(value)))
                            ) {
                                handleChange({
                                    target: { name: 'manga', value: value }
                                });
                            }
                        }}
                        required
                        label="Manga"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={shipData?.capacidadMaximaPasajeros || ''}
                        name="capacidadMaximaPasajeros"
                        onChange={(e: any) => {
                            let value = e.target.value;
                            if ((INTEGERS_UNIT.test(value) || value === '') && value?.length < 16) {
                                handleChange({
                                    target: {
                                        name: 'capacidadMaximaPasajeros',
                                        value: value
                                    }
                                });
                            }
                        }}
                        label="Capacidad Máxima Pasajeros"
                        errors={errors}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={shipData?.puntal || ''}
                        name="puntal"
                        onChange={(e: any) => {
                            let value = e.target.value;
                            if (
                                (value?.length < 16 && INTEGERS_OR_THREE_DECIMALS.test(value)) ||
                                (value === '' && !isNaN(Number(value)))
                            ) {
                                handleChange({
                                    target: { name: 'puntal', value: value }
                                });
                            }
                        }}
                        required
                        label="Puntal"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={shipData?.caladoConstruccion || ''}
                        name="caladoConstruccion"
                        onChange={(e: any) => {
                            let value = e.target.value;
                            if (
                                (value?.length < 16 && INTEGERS_OR_THREE_DECIMALS.test(value)) ||
                                (value === '' && !isNaN(Number(value)))
                            ) {
                                handleChange({
                                    target: {
                                        name: 'caladoConstruccion',
                                        value: value
                                    }
                                });
                            }
                        }}
                        required
                        label="Calado de Construcción"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={shipData?.trb || ''}
                        name="trb"
                        onChange={(e: any) => {
                            let value = e.target.value;
                            if (
                                (value?.length < 16 && INTEGERS_OR_THREE_DECIMALS.test(value)) ||
                                (value === '' && !isNaN(Number(value)))
                            ) {
                                handleChange({
                                    target: { name: 'trb', value: value }
                                });
                            }
                        }}
                        label="TRB"
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={shipData?.trn || ''}
                        name="trn"
                        onChange={(e: any) => {
                            let value = e.target.value;
                            if (
                                (value?.length < 16 && INTEGERS_OR_THREE_DECIMALS.test(value)) ||
                                (value === '' && !isNaN(Number(value)))
                            ) {
                                handleChange({
                                    target: { name: 'trn', value: value }
                                });
                            }
                        }}
                        label="TRN"
                        required
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ShipDimensionsForm;
