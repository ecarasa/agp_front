import _ from 'lodash';
import {
    Box,
    Checkbox,
    Drawer,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material';
import { useIsMobile } from '../../../hooks/useIsMobile';
import Button from '../../button/Button';
import CloseButton from '../../CloseButton';
import DateTimePickerComponent from '../../DateTimePickerComponent';
import dayjs from 'dayjs';
import Input from '../../Input/Input';
import SectionHeader from '../../SectionHeader';

function EditGeneralInfoDrawer(props: any) {
    const {
        openEditGeneralInfoDrawer,
        handleCloseEditDrawer,
        tripGeneralInfo,
        trafficTypes,
        operationTypes,
        handleChangeTripInfo,
        handleUpdateTripData,
        updatingTripData,
        errors,
        dateValidations
    } = props;
    const { isMobile } = useIsMobile();

    return (
        <Drawer
            hideBackdrop
            anchor="right"
            open={openEditGeneralInfoDrawer}
            onClose={handleCloseEditDrawer}
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
                <CloseButton position="right" onClose={handleCloseEditDrawer} />
                <Box
                    component="div"
                    onSubmit={(e: any) => {
                        e.preventDefault();
                    }}
                    sx={{ padding: '10px', gap: '10px', display: 'grid' }}
                >
                    <SectionHeader>
                        <SectionHeader.DrawerTitle>Información del viaje</SectionHeader.DrawerTitle>
                    </SectionHeader>
                    <FormControl fullWidth variant="outlined" required>
                        <InputLabel htmlFor="trafico">Tráfico</InputLabel>
                        <Select
                            labelId="trafico"
                            label="Tráfico"
                            name="idTipoTrafico"
                            value={tripGeneralInfo?.idTipoTrafico || ''}
                            onChange={handleChangeTripInfo}
                            error={!_.isEmpty(errors) && !!errors['idTipoTrafico']}
                        >
                            <MenuItem key={-1} value={''}>
                                Seleccionar
                            </MenuItem>
                            {trafficTypes?.map((item: any) => (
                                <MenuItem key={item?.id} value={item.id}>
                                    {item?.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth variant="outlined" required>
                        <InputLabel htmlFor="operacion">Tipo de operacion</InputLabel>
                        <Select
                            labelId="operacion"
                            label="Tipo de operacion"
                            name="idTipoOperacion"
                            value={tripGeneralInfo?.idTipoOperacion || ''}
                            onChange={handleChangeTripInfo}
                            error={!_.isEmpty(errors) && !!errors['idTipoOperacion']}
                        >
                            <MenuItem key={-1} value={''}>
                                Seleccionar
                            </MenuItem>
                            {operationTypes?.map((item: any) => (
                                <MenuItem key={item?.id} value={item.id}>
                                    {item?.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <p>Fechas definitivas del viaje</p>
                    <DateTimePickerComponent
                        label="Entrada Vanguardia"
                        sx={{ width: '100%' }}
                        value={dayjs(tripGeneralInfo?.fechaEntradaVanguardia) || null}
                        disablePast
                        format="DD/MM/YYYY HH:mm"
                        onChange={(value: any) => {
                            handleChangeTripInfo({
                                target: {
                                    name: 'fechaEntradaVanguardia',
                                    value: value
                                }
                            });
                        }}
                        slotProps={{
                            textField: {
                                required: true,
                                error: !!errors && !!errors['fechaEntradaVanguardia'],
                                helperText: !!errors && errors['fechaEntradaVanguardia']
                            }
                        }}
                    />
                    <DateTimePickerComponent
                        label="Salida Vanguardia"
                        sx={{ width: '100%' }}
                        value={dayjs(tripGeneralInfo?.fechaSalidaVanguardia) || null}
                        disablePast
                        disabled={!tripGeneralInfo?.fechaEntradaVanguardia}
                        format="DD/MM/YYYY HH:mm"
                        onChange={(value: any) => {
                            if (dateValidations('C', value)) return;
                            handleChangeTripInfo({
                                target: {
                                    name: 'fechaSalidaVanguardia',
                                    value: value
                                }
                            });
                        }}
                        slotProps={{
                            textField: {
                                error: !!errors && !!errors['fechaSalidaVanguardia'],
                                helperText: !!errors && errors['fechaSalidaVanguardia']
                            }
                        }}
                    />

                    <FormControlLabel
                        sx={{ width: 'auto' }}
                        control={
                            <Checkbox
                                name="buqueInactivo"
                                checked={tripGeneralInfo?.buqueInactivo || false}
                                value={tripGeneralInfo?.buqueInactivo || false}
                                onChange={handleChangeTripInfo}
                            />
                        }
                        label="Buque inactivo"
                    />

                    <Input
                        label="Nota"
                        name="nota"
                        value={tripGeneralInfo?.nota || ''}
                        onChange={handleChangeTripInfo}
                    />
                </Box>
                <Box sx={{ margin: '40px 0', textAlign: 'center' }}>
                    <Button
                        loading={updatingTripData}
                        type="outlined"
                        onClick={handleUpdateTripData}
                        disabled={
                            !tripGeneralInfo?.idTipoTrafico ||
                            !tripGeneralInfo?.idTipoOperacion ||
                            !tripGeneralInfo?.fechaEntradaVanguardia ||
                            !!errors?.fechaSalidaVanguardia
                        }
                    >
                        ACTUALIZAR
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}

export default EditGeneralInfoDrawer;
