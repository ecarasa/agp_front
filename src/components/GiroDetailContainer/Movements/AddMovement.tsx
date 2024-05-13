import { Box, Grid } from '@mui/material';
import { INTEGERS_UNIT } from '../../../constants/regex';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import AutocompleteComponent from '../../layout/Autocomplete';
import Button from '../../button/Button';
import DateTimePickerComponent from '../../DateTimePickerComponent';
import dayjs from 'dayjs';
import Input from '../../Input/Input';
import SectionFormAccordion from '../../SectionFormAccordion/SectionFormAccordion';
import SectionHeader from '../../SectionHeader';
import useEditDocking from '../hooks/useEditDocking';

function AddMovement() {
    const { isMobile } = useIsMobile();
    const navigate = useNavigate();
    const {
        confirmAction,
        handleChangeForm,
        form,
        setForm,
        terminals,
        loadingTerminals,
        addingNewMov
    } = useEditDocking({});

    return (
        <>
            <SectionHeader>
                {!isMobile && <SectionHeader.Title>Agregar Nuevo Movimiento</SectionHeader.Title>}
            </SectionHeader>
            <Box
                sx={{
                    fontSize: '18px',
                    padding: { sm: 0, md: '0 65px' }
                }}
                justifyContent="flex-end"
            >
                <Box
                    mt={4}
                    component="form"
                    onSubmit={(e: any) => {
                        e.preventDefault();
                        confirmAction('add');
                    }}
                >
                    <SectionFormAccordion title="Solicitudes de Movimientos" staticDropDown>
                        <Grid item xs={12} sm={6}>
                            <AutocompleteComponent
                                value={form?.terminal}
                                onChange={(value: any) => {
                                    if (!value && form?.terminal) {
                                        let newObject = { ...form };
                                        delete newObject?.terminal;
                                        return setForm(newObject);
                                    }
                                    setForm({
                                        ...form,
                                        terminal: value
                                    });
                                }}
                                label="Terminal"
                                name="terminal"
                                options={terminals || []}
                                loading={loadingTerminals}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <AutocompleteComponent
                                value={form?.muelle}
                                onChange={(value: any) => {
                                    if (!value && form?.muelle) {
                                        let newObject = { ...form };
                                        delete newObject?.muelle;
                                        return setForm(newObject);
                                    }
                                    setForm({
                                        ...form,
                                        muelle: value
                                    });
                                }}
                                label="Sitio"
                                name="sitio"
                                options={form?.terminal?.muelle || []}
                                loading={loadingTerminals}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                label="Andana"
                                value={form?.andana || ''}
                                name="andana"
                                onChange={(event: any) => {
                                    let value = event.target.value;
                                    if (
                                        (INTEGERS_UNIT.test(value) || value === '') &&
                                        Number(value) < 6
                                    ) {
                                        handleChangeForm(event);
                                    }
                                }}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}></Grid>
                        <Grid item xs={6}>
                            <DateTimePickerComponent
                                label="Fecha Ingreso"
                                sx={{ width: '100%' }}
                                value={(form?.fechaIngreso && dayjs(form?.fechaIngreso)) || null}
                                format="DD/MM/YYYY HH:mm"
                                onChange={(value: any) => {
                                    handleChangeForm({
                                        target: {
                                            name: 'fechaIngreso',
                                            value: value
                                        }
                                    });
                                }}
                                slotProps={{
                                    textField: {
                                        required: true,
                                        name: 'fechaIngreso'
                                        // error:
                                        //     !_.isEmpty(errors) && !!errors[item?.id]?.fechaIngreso,
                                        // helperText:
                                        //     !_.isEmpty(errors) && errors[item?.id]?.fechaIngreso
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DateTimePickerComponent
                                label="Fecha Egreso"
                                sx={{ width: '100%' }}
                                value={(form?.fechaEgreso && dayjs(form?.fechaEgreso)) || null}
                                format="DD/MM/YYYY HH:mm"
                                onChange={(value: any) => {
                                    handleChangeForm({
                                        target: {
                                            name: 'fechaEgreso',
                                            value: value
                                        }
                                    });
                                }}
                                slotProps={{
                                    textField: {
                                        required: true,
                                        name: 'fechaEgreso'
                                        // error:
                                        //     !_.isEmpty(errors) && !!errors[item?.id]?.fechaIngreso,
                                        // helperText:
                                        //     !_.isEmpty(errors) && errors[item?.id]?.fechaIngreso
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} mt={4}>
                            <Button
                                type="outlined"
                                style={{
                                    backgroundColor: '#fff',
                                    fontWeight: 700,
                                    textTransform: 'uppercase'
                                }}
                                loading={addingNewMov}
                            >
                                Agregar
                            </Button>
                        </Grid>
                    </SectionFormAccordion>
                </Box>
                <Box className="flex-center">
                    <Button
                        type="outlined"
                        onClick={() => navigate(-1)}
                        style={{ minWidth: 120, marginTop: 40 }}
                    >
                        Volver
                    </Button>
                </Box>
            </Box>
        </>
    );
}

export default AddMovement;
