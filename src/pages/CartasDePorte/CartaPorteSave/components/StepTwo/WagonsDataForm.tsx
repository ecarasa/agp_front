import _ from 'lodash';
import { Grid } from '@mui/material';
import { INTEGERS_UNIT } from '../../../../../constants/regex';
import Button from '../../../../../components/button/Button';
import DataTable from '../../../../../components/DataTable/DataTable';
import DeleteIcon from '@mui/icons-material/Delete';
import Input from '../../../../../components/Input/Input';
import useWagonSave from '../../hooks/useWagonSave';

function WagonsDataForm(props: any) {
    const { id, data, handleChangeData, handleEdit } = props;

    const { errors, wagon, handleChangeWagon, resetForm, calcularDigitoVerificador } =
        useWagonSave();

    return (
        <>
            <Grid item xs={12} sm={6}>
                <Input
                    value={wagon?.nroVagon || ''}
                    name="nroVagon"
                    label="Número de Vagón"
                    onChange={handleChangeWagon}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Input
                    value={wagon?.nroContenedor || ''}
                    name="nroContenedor"
                    label="Número de Contenedor"
                    onChange={handleChangeWagon}
                    onBlur={calcularDigitoVerificador}
                    errors={errors}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Input
                    value={wagon?.descripcion || ''}
                    name="descripcion"
                    label="Descripción de Carga"
                    onChange={handleChangeWagon}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Input
                    value={wagon?.cantidadBultos || ''}
                    name="cantidadBultos"
                    label="Número de Bultos"
                    onChange={(e: any) => {
                        let value = e.target.value;
                        if ((INTEGERS_UNIT.test(value) || value === '') && value?.length < 7) {
                            handleChangeWagon({
                                target: {
                                    name: 'cantidadBultos',
                                    value: value
                                }
                            });
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Input
                    value={wagon?.nroPrecinto || ''}
                    name="nroPrecinto"
                    label="Número de Precinto"
                    onChange={handleChangeWagon}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Input
                    value={wagon?.colorPrecinto || ''}
                    name="colorPrecinto"
                    label="Color de Precinto"
                    onChange={handleChangeWagon}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Input
                    value={wagon?.pesoAforo || ''}
                    name="pesoAforo"
                    label="Peso en KG"
                    onChange={(e: any) => {
                        let value = e.target.value;
                        if ((INTEGERS_UNIT.test(value) || value === '') && value?.length < 7) {
                            handleChangeWagon({
                                target: {
                                    name: 'pesoAforo',
                                    value: value
                                }
                            });
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Input
                    value={wagon?.pesoVerificado || ''}
                    name="pesoVerificado"
                    label="Peso Verificado"
                    onChange={(e: any) => {
                        let value = e.target.value;
                        if ((INTEGERS_UNIT.test(value) || value === '') && value?.length < 7) {
                            handleChangeWagon({
                                target: {
                                    name: 'pesoVerificado',
                                    value: value
                                }
                            });
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Input
                    value={wagon?.capacidadCarga || ''}
                    name="capacidadCarga"
                    label="Capacidad de Carga"
                    onChange={(e: any) => {
                        let value = e.target.value;
                        if ((INTEGERS_UNIT.test(value) || value === '') && value?.length < 10) {
                            handleChangeWagon({
                                target: {
                                    name: 'capacidadCarga',
                                    value: value
                                }
                            });
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} textAlign="end" mt={6} mb={2}>
                <Button
                    type="outlined"
                    disabled={!wagon?.nroVagon || !!errors}
                    onClick={() => {
                        const auxWagon = {
                            ...wagon,
                            ...(id && { accion: 'A' }),
                            id: Math.ceil(Math.random() * 10000),
                            date: new Date()
                        };
                        handleChangeData({
                            target: {
                                name: 'detalle',
                                value: [...(data?.detalle || []), ...[auxWagon]]
                            }
                        });
                        resetForm();
                        if (id) handleEdit(auxWagon, 'add');
                    }}
                >
                    Agregar
                </Button>
            </Grid>
            <Grid item xs={12}>
                <DataTable
                    headers={[
                        {
                            upperLabel: (item: any) => (
                                <b>
                                    {data?.detalle?.findIndex((i: any) => i?.id === item?.id) + 1}
                                </b>
                            ),
                            noStyle: true,
                            width: 5
                        },
                        {
                            titles: ['Vagón', 'Contenedor'],
                            upperLabel: (item: any) => <b>{item?.nroVagon}</b>,
                            lowerLabel: (item: any) => <b>{item?.nroContenedor || 'N/A'}</b>,
                            noStyle: true,
                            width: 45
                        },
                        {
                            titles: ['Precinto', 'Color'],
                            upperLabel: (item: any) => <b>{item?.nroPrecinto || 'N/A'}</b>,
                            lowerLabel: (item: any) => <b>{item?.colorPrecinto || 'N/A'}</b>
                        },
                        {
                            type: 'action',
                            icon: <DeleteIcon />,
                            onClick: (e: any, item: any) => {
                                handleChangeData({
                                    target: {
                                        name: 'detalle',
                                        value: data?.detalle?.filter(
                                            (vagon: any) => vagon.id !== item.id
                                        )
                                    }
                                });
                                if (id) handleEdit(item, 'delete');
                            }
                        }
                    ]}
                    onSelectRow={() => {
                        return;
                    }}
                    items={{
                        data: {
                            data: id
                                ? data?.detalle
                                : _.orderBy(data?.detalle, ['date'], ['desc']) || []
                        }
                    }}
                    noPaginated
                    style={{
                        overflowY: 'auto',
                        maxHeight: '360px'
                    }}
                />
            </Grid>
        </>
    );
}

export default WagonsDataForm;
