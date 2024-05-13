import _ from 'lodash';
import { Box } from '@mui/material';
import AutocompleteComponent from '../../../../components/layout/Autocomplete';
import ButtonActions from '../../../../components/ButtonActions';
import DatePickerComponent from '../../../../components/layout/DatePicker';
import Input from '../../../../components/Input/Input';
import SectionHeader from '../../../../components/SectionHeader';
import useEditShips from './hooks/useEditShip';
import OwnerPicker from '../OwnerPicker';

function AssemblerTenantForm({ open, setOpen, shipFullData, countries }: any) {
    const {
        handleSubmit,
        errors,
        submitingData,
        setPropertyData,
        handleChange,
        propertyData,
        assemblers,
        loadingTenants,
        loadingAssemblers,
        tenants,
        assemblerCities,
        tenantCities,
        loadingCities,
        fetchingCities,
        getValue,
        handleChangeOwnersData,
        ownersData,
        getPropertyValidation
    } = useEditShips({
        shipFullData,
        open
    });

    return (
        <>
            <SectionHeader>
                <SectionHeader.DrawerTitle>Propietario</SectionHeader.DrawerTitle>
            </SectionHeader>
            <Box
                component="form"
                onSubmit={(e: any) => {
                    e.preventDefault();
                    handleSubmit(setOpen, 'propertyData');
                }}
                sx={{ padding: '10px' }}
            >
                <Box mb={1}>
                    <OwnerPicker
                        value="armador"
                        handleChangeOwnersData={handleChangeOwnersData}
                        ownersData={ownersData}
                    />
                </Box>
                {ownersData?.armador ? (
                    <Input
                        value={propertyData?.armador?.nombre || ''}
                        label="Nombre"
                        name="nombre"
                        onChange={(e: any) => handleChange(e, 'armador')}
                        required
                    />
                ) : (
                    <AutocompleteComponent
                        value={propertyData?.armador}
                        name="nombre_armador"
                        label="Nombre"
                        onChange={(value: any) => {
                            handleChange(
                                { ...(value || { value: null }), user: 'armador' },
                                'autoselect'
                            );
                        }}
                        options={assemblers || []}
                        loading={loadingAssemblers}
                        required
                    />
                )}
                <Input
                    value={propertyData?.armador?.domicilio || ''}
                    name="domicilio"
                    label="Dirección"
                    readOnly={!!propertyData?.armador?.id}
                    onChange={(e: any) => handleChange(e, 'armador')}
                    errors={errors}
                    required
                />
                <Input
                    value={propertyData?.armador?.telefono || ''}
                    name="telefono"
                    readOnly={!!propertyData?.armador?.id}
                    label="Teléfono"
                    onChange={(e: any) => handleChange(e, 'armador')}
                    errors={errors}
                    required
                />

                <AutocompleteComponent
                    value={getValue({
                        options: countries,
                        id: propertyData?.armador?.idPais
                    })}
                    onChange={(value: { id: number }) => {
                        setPropertyData({
                            ...propertyData,
                            armador: {
                                ...propertyData?.armador,
                                idPais: value?.id
                            }
                        });
                    }}
                    readOnly={!!propertyData?.armador?.id}
                    label="Bandera"
                    name="idPais_armador"
                    errors={errors}
                    templateLabel={(option: any) => option.nombre}
                    options={countries || []}
                    required
                />

                <AutocompleteComponent
                    value={getValue({
                        options: assemblerCities,
                        id: propertyData?.armador?.idCiudad
                    })}
                    disabled={!propertyData?.armador?.idPais}
                    readOnly={!!propertyData?.armador?.id}
                    onChange={(value: { id: number }) =>
                        setPropertyData({
                            ...propertyData,
                            armador: {
                                ...propertyData?.armador,
                                idCiudad: value?.id
                            }
                        })
                    }
                    name="idCiudad_armador"
                    label="Ciudad"
                    options={assemblerCities || []}
                    loading={loadingCities || fetchingCities}
                    required
                />

                <SectionHeader>
                    <SectionHeader.DrawerTitle>Locatario</SectionHeader.DrawerTitle>
                </SectionHeader>
                <Box mb={1}>
                    <OwnerPicker
                        value="locatario"
                        handleChangeOwnersData={handleChangeOwnersData}
                        ownersData={ownersData}
                    />
                </Box>
                {ownersData?.locatario ? (
                    <Input
                        value={propertyData?.locatario?.nombre || ''}
                        label="Nombre"
                        name="nombre"
                        onChange={(e: any) => handleChange(e, 'locatario')}
                    />
                ) : (
                    <AutocompleteComponent
                        value={propertyData?.locatario}
                        name="nombre_locatario"
                        label="Nombre"
                        onChange={(value: any) => {
                            handleChange(
                                { ...(value || { value: null }), user: 'locatario' },
                                'autoselect'
                            );
                        }}
                        options={tenants || []}
                        loading={loadingTenants}
                    />
                )}
                <Input
                    value={propertyData?.locatario?.domicilio || ''}
                    name="domicilio"
                    label="Dirección"
                    readOnly={!!propertyData?.locatario?.id}
                    disabled={!propertyData?.locatario?.nombre}
                    onChange={(e: any) => handleChange(e, 'locatario')}
                    required={!!propertyData?.locatario?.nombre}
                    errors={errors}
                />
                <Input
                    value={propertyData?.locatario?.telefono || ''}
                    name="telefono"
                    label="Teléfono"
                    readOnly={!!propertyData?.locatario?.id}
                    disabled={!propertyData?.locatario?.nombre}
                    onChange={(e: any) => handleChange(e, 'locatario')}
                    required={!!propertyData?.locatario?.nombre}
                    errors={errors}
                />
                <AutocompleteComponent
                    value={getValue({
                        options: countries,
                        id: propertyData?.locatario?.idPais
                    })}
                    onChange={(value: { id: number }) => {
                        setPropertyData({
                            ...propertyData,
                            locatario: {
                                ...propertyData?.locatario,
                                idPais: value?.id
                            }
                        });
                    }}
                    label="Bandera"
                    name="idPais_locatario"
                    readOnly={!!propertyData?.locatario?.id}
                    required={!!propertyData?.locatario?.nombre}
                    disabled={!propertyData?.locatario?.nombre}
                    errors={errors}
                    templateLabel={(option: any) => option.nombre}
                    options={countries || []}
                />
                <AutocompleteComponent
                    value={getValue({
                        options: tenantCities,
                        id: propertyData?.locatario?.idCiudad
                    })}
                    disabled={!propertyData?.locatario?.idPais || !propertyData?.locatario?.nombre}
                    readOnly={!!propertyData?.locatario?.id}
                    onChange={(value: { id: number }) =>
                        setPropertyData({
                            ...propertyData,
                            locatario: {
                                ...propertyData?.locatario,
                                idCiudad: value?.id
                            }
                        })
                    }
                    name="idCiudad_locatario"
                    label="Ciudad"
                    options={tenantCities || []}
                    loading={loadingCities || fetchingCities}
                    required
                />

                <DatePickerComponent
                    required={!!propertyData?.locatario?.nombre}
                    helperText={
                        !!propertyData?.locatario?.nombre && !propertyData.locatario?.fechaDesde
                            ? 'Campo requerido*'
                            : null
                    }
                    value={propertyData?.locatario?.fechaDesde || ''}
                    label="Fecha de Inicio de locación"
                    name="fechaDesde"
                    setValue={(value: any) =>
                        handleChange(
                            {
                                target: {
                                    name: 'fechaDesde',
                                    value: value
                                }
                            },
                            'locatario'
                        )
                    }
                    width="100%"
                    disabled={!propertyData?.locatario?.nombre}
                    errors={!_.isEmpty(errors) && errors}
                />

                <DatePickerComponent
                    required={!!propertyData?.locatario?.nombre}
                    helperText={
                        !!propertyData?.locatario?.nombre && !propertyData.locatario?.fechaHasta
                            ? 'Campo requerido*'
                            : null
                    }
                    value={propertyData?.locatario?.fechaHasta || ''}
                    name="fechaHasta"
                    label="Vencimiento de locación"
                    setValue={(value: any) =>
                        handleChange(
                            {
                                target: {
                                    name: 'fechaHasta',
                                    value: value
                                }
                            },
                            'locatario'
                        )
                    }
                    width="100%"
                    disablePast
                    disabled={!propertyData?.locatario?.nombre}
                    errors={!_.isEmpty(errors) && errors}
                />

                <Box sx={{ margin: '40px 0' }}>
                    <ButtonActions
                        disabled={getPropertyValidation()}
                        renderBackAction
                        handleClose={() => setOpen(false)}
                        returnText="Cerrar"
                        flexDirection="column-reverse"
                        loading={submitingData}
                    />
                </Box>
            </Box>
        </>
    );
}

export default AssemblerTenantForm;
