import _ from 'lodash';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ButtonActions from '../../../ButtonActions';
import DateTimePickerComponent from '../../../DateTimePickerComponent';
import dayjs from 'dayjs';
import DrawerContainer from '../../../DrawerContainer';

function EditPatentMovementDrawer(props: any) {
    const {
        openDrawer,
        handleCloseDrawer,
        data,
        handleChangeData,
        errors,
        validateDates,
        handleSubmit,
        edittingMovement,
        checkIsEqual
    } = props;

    return (
        <DrawerContainer
            title="Editar estadía"
            openDrawer={openDrawer}
            handleCloseDrawer={handleCloseDrawer}
            handleSubmit={handleSubmit}
        >
            <>
                <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="Andana">Andana</InputLabel>
                    <Select
                        labelId="Andana"
                        label="Andana"
                        name="andana"
                        value={data?.andana || ''}
                        onChange={handleChangeData}
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
                    value={(data?.fechaEntrada && dayjs(data?.fechaEntrada)) || null}
                    onChange={(value: any) => {
                        validateDates(value, 'fechaEntrada');
                        handleChangeData({
                            target: {
                                name: 'fechaEntrada',
                                value: value
                            }
                        });
                    }}
                    disableFuture
                    slotProps={{
                        textField: {
                            required: false,
                            name: 'fechaEntrada',
                            error: !_.isEmpty(errors) && !!errors['fechaEntrada'],
                            helperText: !_.isEmpty(errors) && errors['fechaEntrada']
                        }
                    }}
                />

                <DateTimePickerComponent
                    label="Fecha Salida"
                    sx={{ width: '100%' }}
                    value={(data?.fechaSalida && dayjs(data?.fechaSalida)) || null}
                    format="DD/MM/YYYY HH:mm"
                    disableFuture
                    name="fechaSalida"
                    onChange={(value: any) => {
                        validateDates(value, 'fechaSalida');
                        handleChangeData({
                            target: {
                                name: 'fechaSalida',
                                value: value
                            }
                        });
                    }}
                    slotProps={{
                        textField: {
                            required: false,
                            name: 'fechaSalida',
                            error: !_.isEmpty(errors) && !!errors['fechaSalida'],
                            helperText: !_.isEmpty(errors) && errors['fechaSalida']
                        }
                    }}
                />

                <Box sx={{ margin: '40px 0' }}>
                    <ButtonActions
                        disabled={!_.isEmpty(errors) || checkIsEqual()}
                        renderBackAction
                        confirmText="Editar"
                        handleClose={handleCloseDrawer}
                        returnText="Cerrar"
                        flexDirection="column-reverse"
                        loading={edittingMovement}
                    />
                </Box>
            </>
        </DrawerContainer>
    );
}

export default EditPatentMovementDrawer;
