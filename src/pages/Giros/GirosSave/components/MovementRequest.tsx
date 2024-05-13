import _ from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { Grid } from '@mui/material';
import { INTEGERS_UNIT } from '../../../../constants/regex';
import AutocompleteComponent from '../../../../components/layout/Autocomplete';
import Button from '../../../../components/button/Button';
import DataTable from '../../../../components/DataTable/DataTable';
import DateTimePickerComponent from '../../../../components/DateTimePickerComponent';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import Input from '../../../../components/Input/Input';
import SectionFormAccordion from '../../../../components/SectionFormAccordion/SectionFormAccordion';
import useMovementRequest from '../hooks/useMovementRequest';
import WarningAlert from '../../../../components/WarningAlert';

function MovementRequest(props: any) {
    const {
        data,
        stepValidation,
        alerts,
        handleChange,
        validatingData,
        validateData,
        handleValidationSteps
    } = props;

    const {
        movement,
        errors,
        terminals,
        isLoading,
        setErrors,
        setMovement,
        isBefore,
        overlappingMovement,
        handleValidation
    } = useMovementRequest({
        data
    });

    return (
        <>
            <SectionFormAccordion title="Ingreso">
                <Grid item xs={12} sm={6}>
                    <Input
                        name="nroEntrada"
                        label="Número de entrada"
                        value={data?.nroEntrada || ''}
                        onChange={(e: any) => {
                            let value = e.target.value;
                            if ((INTEGERS_UNIT.test(value) || value === '') && value?.length < 20) {
                                handleChange({
                                    target: { name: 'nroEntrada', value: value }
                                });
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        name="nroSalida"
                        label="Número de salida"
                        value={data?.nroSalida || ''}
                        onChange={(e: any) => {
                            let value = e.target.value;
                            if ((INTEGERS_UNIT.test(value) || value === '') && value?.length < 20) {
                                handleChange({
                                    target: { name: 'nroSalida', value: value }
                                });
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DateTimePickerComponent
                        label="Ingreso RADA"
                        sx={{ width: '100%' }}
                        value={(data?.fechaIngresoRada && dayjs(data?.fechaIngresoRada)) || null}
                        disablePast
                        format="DD/MM/YYYY HH:mm"
                        onChange={(value: any) => {
                            if (isBefore(value)) return;
                            handleChange({
                                target: {
                                    name: 'fechaIngresoRada',
                                    value: value
                                }
                            });
                        }}
                        slotProps={{
                            textField: {
                                error: !!errors && !!errors['fechaIngresoRada'],
                                helperText: !!errors && errors['fechaIngresoRada']
                            }
                        }}
                    />
                </Grid>
            </SectionFormAccordion>

            <SectionFormAccordion title="Solicitudes de movimientos">
                {alerts?.movimientos && (
                    <Grid item xs={12}>
                        <WarningAlert>{alerts?.movimientos || ''}</WarningAlert>
                    </Grid>
                )}
                <Grid item xs={12} sm={6}>
                    <AutocompleteComponent
                        value={movement?.terminal}
                        onChange={(value: any) => {
                            if (!value && movement?.terminal) {
                                let newObject = { ...movement };
                                delete newObject?.terminal;
                                return setMovement(newObject);
                            }
                            setMovement({
                                ...movement,
                                terminal: value
                            });
                        }}
                        disabled={data?.movimientos?.length === 10}
                        label="Terminal"
                        name="terminal"
                        options={terminals || []}
                        loading={isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AutocompleteComponent
                        value={movement?.muelle}
                        onChange={(value: any) => {
                            if (!value && movement?.muelle) {
                                let newObject = { ...movement };
                                delete newObject?.muelle;
                                return setMovement(newObject);
                            }
                            setMovement({
                                ...movement,
                                muelle: value
                            });
                        }}
                        disabled={data?.movimientos?.length === 10}
                        label="Sitio"
                        name="sitio"
                        options={movement?.terminal?.muelle || []}
                        loading={isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DateTimePickerComponent
                        sx={{ width: '100%' }}
                        label="Fecha de Ingreso"
                        value={(movement?.fechaInicio && dayjs(movement?.fechaInicio)) || null}
                        onChange={(value: any) => {
                            handleValidation(value, 'fechaInicio');
                        }}
                        format="DD/MM/YYYY HH:mm"
                        disabled={data?.movimientos?.length === 10}
                        slotProps={{
                            textField: {
                                name: 'fechaInicio',
                                error: !!errors && !!errors['fechaInicio'],
                                helperText: !!errors && errors['fechaInicio']
                            }
                        }}
                        disablePast
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DateTimePickerComponent
                        sx={{ width: '100%' }}
                        value={(movement?.fechaFin && dayjs(movement?.fechaFin)) || null}
                        label="Fecha de Egreso"
                        onChange={(value: any) => {
                            handleValidation(value, 'fechaFin');
                        }}
                        format="DD/MM/YYYY HH:mm"
                        disabled={
                            data?.movimientos?.length === 10 ||
                            !movement?.fechaInicio ||
                            (!_.isEmpty(errors) && !!errors['fechaInicio'])
                        }
                        slotProps={{
                            textField: {
                                name: 'fechaFin',
                                error: !!errors && !!errors['fechaFin'],
                                helperText: !!errors && errors['fechaFin']
                            }
                        }}
                        disablePast
                    />
                </Grid>
                <Grid item xs={12} textAlign="end" mt={6} mb={2}>
                    <Button
                        type="outlined"
                        disabled={
                            _.keys(movement)?.length < 4 ||
                            data?.movimientos?.length === 10 ||
                            !_.isEmpty(errors)
                        }
                        onClick={() => {
                            const newMovement = {
                                id: Math.ceil(Math.random() * 1000).toString(),
                                fechaInicio: movement?.fechaInicio,
                                fechaFin: movement?.fechaFin,
                                terminal: {
                                    idTerminal: movement?.terminal?.id,
                                    nombre: movement?.terminal?.nombre
                                },
                                muelle: {
                                    idMuelle: movement?.muelle?.id,
                                    nombre: movement?.muelle?.nombre
                                }
                            };
                            if (overlappingMovement(newMovement)) {
                                const msg =
                                    'Las fechas de ingreso y egreso estan asignadas a otro movimiento.';
                                setErrors({
                                    fechaInicio: msg,
                                    fechaFin: msg
                                });
                                return enqueueSnackbar(msg, { variant: 'error' });
                            } else {
                                setErrors(null);
                            }
                            handleChange({
                                target: {
                                    name: 'movimientos',
                                    value: [...(data?.movimientos || []), ...[newMovement]]
                                }
                            });
                            if (stepValidation?.thirdStepValidated) handleValidationSteps();
                            setMovement(null);
                        }}
                    >
                        Agregar
                    </Button>
                </Grid>

                <Grid item xs={12}>
                    <DataTable
                        headers={[
                            {
                                upperLabel: (item: any) =>
                                    dayjs(item?.fechaInicio).format('DD/MM/YYYY HH:mm'),
                                lowerLabel: (item: any) =>
                                    dayjs(item?.fechaFin).format('DD/MM/YYYY HH:mm'),
                                noStyle: true
                            },
                            {
                                titles: ['Terminal', 'Sitio'],
                                upperLabel: (item: any) => item?.terminal?.nombre,
                                lowerLabel: (item: any) => item?.muelle?.nombre,
                                width: 25
                            },
                            {
                                type: 'action',
                                icon: <DeleteIcon />,
                                onClick: (e: any, item: any) =>
                                    handleChange({
                                        target: {
                                            name: 'movimientos',
                                            value: data?.movimientos?.filter(
                                                (mov: any) => mov.id !== item.id
                                            )
                                        }
                                    })
                            }
                        ]}
                        onSelectRow={() => {
                            return;
                        }}
                        filters={{ take: 0 }}
                        items={{ data: { data: data?.movimientos || [] } }}
                        noPaginated
                        style={{
                            overflowY: 'auto',
                            maxHeight: '360px'
                        }}
                    />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        disabled={stepValidation?.thirdStepValidated || !data?.movimientos?.length}
                        type="outlined"
                        onClick={validateData}
                        loading={validatingData}
                    >
                        Validar movimientos
                    </Button>
                </Grid>
            </SectionFormAccordion>
        </>
    );
}

export default MovementRequest;
