import _ from 'lodash';
import { Box, Divider, Drawer, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useIsMobile } from '../../../hooks/useIsMobile';
import AutocompleteComponent from '../../layout/Autocomplete';
import ButtonActions from '../../ButtonActions';
import CloseButton from '../../CloseButton';
import DateTimePickerComponent from '../../DateTimePickerComponent';
import Input from '../../Input/Input';
import SectionHeader from '../../SectionHeader';

function OperationsLogDrawer(props: any) {
    const {
        openOperationLogDrawer,
        handleCloseOperationLogDrawer,
        operationData,
        handleChangeOperationData,
        isNavi,
        addingOperation,
        handleSubmitOperation,
        terminals,
        loadingTerminals,
        validateDates,
        errors
    } = props;
    const { isMobile } = useIsMobile();
    return (
        <Drawer
            anchor="right"
            open={openOperationLogDrawer}
            onClose={handleCloseOperationLogDrawer}
        >
            <Box
                sx={{
                    marginTop: '64px',
                    width: isMobile ? '100vw' : 420,
                    height: '100%',
                    padding: '20px',
                    '& .MuiFormControl-root': { m: '8px 0', width: '100%' }
                }}
                role="presentation"
            >
                <CloseButton position="right" onClose={handleCloseOperationLogDrawer} />
                <Box
                    component="form"
                    onSubmit={(e: any) => {
                        e.preventDefault();
                        handleSubmitOperation(handleCloseOperationLogDrawer);
                    }}
                    sx={{ padding: '10px', gap: '10px', display: 'grid' }}
                >
                    <SectionHeader>
                        <SectionHeader.DrawerTitle>
                            Registro de movimiento
                        </SectionHeader.DrawerTitle>
                    </SectionHeader>

                    <Box display="contents" sx={{ fontSize: '17px' }}>
                        <span>Terminal: </span>
                        <span>
                            {operationData?.nuevoRegistro ? (
                                <AutocompleteComponent
                                    value={operationData?.terminal}
                                    onChange={(value: any) =>
                                        handleChangeOperationData({
                                            target: {
                                                name: 'terminal',
                                                value: value
                                            }
                                        })
                                    }
                                    label="Terminal"
                                    name="terminal"
                                    options={terminals || []}
                                    loading={loadingTerminals}
                                    required
                                />
                            ) : (
                                <b>{operationData?.terminal?.nombre}</b>
                            )}
                        </span>
                        <span>Muelle: </span>
                        <span>
                            {operationData?.nuevoRegistro ? (
                                <AutocompleteComponent
                                    value={operationData?.muelle}
                                    onChange={(value: any) =>
                                        handleChangeOperationData({
                                            target: {
                                                name: 'muelle',
                                                value: value
                                            }
                                        })
                                    }
                                    label="Muelle"
                                    name="muelle"
                                    options={operationData?.terminal?.muelle || []}
                                    loading={loadingTerminals}
                                />
                            ) : (
                                <b>{operationData?.muelle?.nombre}</b>
                            )}
                        </span>
                    </Box>
                    <Divider sx={{ margin: '8px 0' }} />
                    <FormControl fullWidth variant="outlined" required>
                        <InputLabel htmlFor="Andana">Andana</InputLabel>
                        <Select
                            labelId="Andana"
                            label="Andana"
                            name="andana"
                            value={operationData?.andana || ''}
                            onChange={handleChangeOperationData}
                        >
                            <MenuItem key={-1} value={''}>
                                Seleccionar
                            </MenuItem>
                            {[1, 2, 3, 4, 5].map((value: any) => (
                                <MenuItem key={value} value={value}>
                                    {value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <DateTimePickerComponent
                        label="Fecha Entrada"
                        sx={{ width: '100%' }}
                        value={operationData?.fechaEntrada || null}
                        format="DD/MM/YYYY HH:mm"
                        onChange={(value: any) => {
                            validateDates(value, 'fechaEntrada');
                            handleChangeOperationData({
                                target: {
                                    name: 'fechaEntrada',
                                    value: value
                                }
                            });
                        }}
                        disableFuture
                        slotProps={{
                            textField: {
                                required: true,
                                name: 'fechaEntrada',
                                error: !_.isEmpty(errors) && !!errors['fechaEntrada'],
                                helperText: !_.isEmpty(errors) && errors['fechaEntrada']
                            }
                        }}
                    />

                    <DateTimePickerComponent
                        label="Fecha Salida"
                        sx={{ width: '100%' }}
                        value={operationData?.fechaSalida || null}
                        format="DD/MM/YYYY HH:mm"
                        name
                        onChange={(value: any) => {
                            validateDates(value, 'fechaSalida');
                            handleChangeOperationData({
                                target: {
                                    name: 'fechaSalida',
                                    value: value
                                }
                            });
                        }}
                        disabled={!operationData?.fechaEntrada}
                        disableFuture
                        slotProps={{
                            textField: {
                                required: true,
                                name: 'fechaSalida',
                                error: !_.isEmpty(errors) && !!errors['fechaSalida'],
                                helperText: !_.isEmpty(errors) && errors['fechaSalida']
                            }
                        }}
                    />
                    <Box mt={4}>
                        <Input
                            label="Nota"
                            placeholder="Escribe una nota"
                            name="nota"
                            value={operationData?.nota || ''}
                            onChange={handleChangeOperationData}
                        />
                    </Box>
                    <Box sx={{ margin: '40px 0' }}>
                        <ButtonActions
                            confirmText="Registrar"
                            renderBackAction
                            returnText="Cancelar"
                            handleClose={handleCloseOperationLogDrawer}
                            flexDirection="column-reverse"
                            loading={addingOperation}
                            disabled={!_.isEmpty(errors)}
                        />
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
}

export default OperationsLogDrawer;
