import _ from 'lodash';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { INTEGERS_UNIT } from '../../../../constants/regex';
import AutocompleteComponent from '../../../../components/layout/Autocomplete';
import Button from '../../../../components/button/Button';
import DataTable from '../../../../components/DataTable/DataTable';
import DeleteIcon from '@mui/icons-material/Delete';
import Input from '../../../../components/Input/Input';
import SectionFormAccordion from '../../../../components/SectionFormAccordion/SectionFormAccordion';
import useMovementRequest from '../../../Giros/GirosSave/hooks/useMovementRequest';

const quarterOptions = [
    { id: 1, nombre: 'Enero-Marzo' },
    { id: 2, nombre: 'Abril-Junio' },
    { id: 3, nombre: 'Julio-Septiembre' },
    { id: 4, nombre: 'Octubre-Diciembre' }
];

function PatentMovementRequest(props: any) {
    const {
        data,
        stepValidation,
        alerts,
        handleChange,
        validatingData,
        validateData,
        handleValidationSteps,
        getDisabledQuarter,
        yearOptions
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
            <SectionFormAccordion title="Trimestre">
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined" required>
                        <InputLabel htmlFor="Año">Año</InputLabel>
                        <Select
                            labelId="Año"
                            label="Año"
                            name="anio"
                            value={data?.anio || ''}
                            onChange={handleChange}
                        >
                            <MenuItem key={-1} value={''}>
                                Seleccionar
                            </MenuItem>
                            {yearOptions()?.map((item: any) => (
                                <MenuItem key={item?.id} value={item.value}>
                                    {item?.value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined" required>
                        <InputLabel htmlFor="Trimestre">Trimestre</InputLabel>
                        <Select
                            labelId="Trimestre"
                            label="Trimestre"
                            name="trimestre"
                            value={data?.trimestre || ''}
                            onChange={handleChange}
                        >
                            <MenuItem key={-1} value={''}>
                                Seleccionar
                            </MenuItem>
                            {quarterOptions?.map((item: any) => (
                                <MenuItem
                                    key={item?.id}
                                    value={item.id}
                                    disabled={getDisabledQuarter(item)}
                                >
                                    {item?.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </SectionFormAccordion>

            <SectionFormAccordion title="Asignación de Sitio">
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
                        disabled={data?.movimientos?.length === 20}
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
                        disabled={data?.movimientos?.length === 20}
                        label="Sitio"
                        name="sitio"
                        options={
                            movement?.terminal?.muelle?.filter(
                                (i: any) =>
                                    !data?.movimientos?.find(
                                        (movs: any) => movs?.muelle?.idMuelle === i?.id
                                    )
                            ) || []
                        }
                        loading={isLoading}
                    />
                </Grid>

                <Grid item xs={12} textAlign="end" mt={6} mb={2}>
                    <Button
                        type="outlined"
                        disabled={
                            _.keys(movement)?.length < 2 ||
                            data?.movimientos?.length === 20 ||
                            !_.isEmpty(errors)
                        }
                        onClick={() => {
                            const newMovement = {
                                id: Math.ceil(Math.random() * 1000).toString(),
                                terminal: {
                                    idTerminal: movement?.terminal?.id,
                                    nombre: movement?.terminal?.nombre
                                },
                                muelle: {
                                    idMuelle: movement?.muelle?.id,
                                    nombre: movement?.muelle?.nombre
                                }
                            };
                            handleChange({
                                target: {
                                    name: 'movimientos',
                                    value: [...(data?.movimientos || []), ...[newMovement]]
                                }
                            });
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
                                titles: ['Terminal'],
                                upperLabel: (item: any) => item?.terminal?.nombre,
                                width: 25
                            },
                            {
                                titles: ['Sitio'],
                                upperLabel: (item: any) => item?.muelle?.nombre,
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
            </SectionFormAccordion>
        </>
    );
}

export default PatentMovementRequest;
