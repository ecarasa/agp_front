import _ from 'lodash';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AutocompleteComponent from '../../../../components/layout/Autocomplete';
import DatePickerComponent from '../../../../components/layout/DatePicker';
import Input from '../../../../components/Input/Input';
import OwnerPicker from '../../components/OwnerPicker';

function TenantForm(props: any) {
    const {
        shipData,
        setShipData,
        isLoading,
        tenants,
        handleChange,
        getValue,
        loadingTenants,
        errors,
        setErrors,
        loadingCountries,
        tenantCities,
        countries,
        ownersData,
        handleChangeOwnersData
    } = props;
    const { t } = useTranslation('userForm');

    return (
        <Grid item xs={12}>
            <Grid container spacing={3} columnSpacing={{ xs: 12, sm: 6, lg: 24 }}>
                <Grid item xs={12}>
                    <OwnerPicker
                        value="locatario"
                        handleChangeOwnersData={handleChangeOwnersData}
                        ownersData={ownersData}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    {ownersData?.locatario ? (
                        <Input
                            value={shipData?.locatario?.nombre || ''}
                            label="Nombre"
                            name="nombre"
                            onChange={(e: any) => handleChange(e, 'locatario')}
                        />
                    ) : (
                        <AutocompleteComponent
                            value={shipData?.locatario}
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
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={shipData?.locatario?.domicilio || ''}
                        readOnly={!!shipData?.locatario?.id}
                        name="domicilio"
                        onChange={(e: any) => handleChange(e, 'locatario')}
                        label="Dirección"
                        required={!!shipData?.locatario?.nombre}
                        disabled={!shipData?.locatario?.nombre}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <AutocompleteComponent
                        value={getValue({
                            options: countries,
                            id: shipData?.locatario?.idPais
                        })}
                        onChange={(value: { id: number }) =>
                            setShipData({
                                ...shipData,
                                locatario: {
                                    ...shipData?.locatario,
                                    idPais: value?.id
                                }
                            })
                        }
                        templateLabel={(option: any) => option.nombre}
                        readOnly={!!shipData?.locatario?.id}
                        name="idPais_locatario"
                        label="Pais"
                        options={countries || []}
                        loading={loadingCountries}
                        required={!!shipData?.locatario?.nombre}
                        disabled={!shipData?.locatario?.nombre}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={shipData?.locatario?.telefono || ''}
                        name="telefono"
                        onChange={(e: any) => handleChange(e, 'locatario')}
                        label="Teléfono"
                        readOnly={!!shipData?.locatario?.id}
                        required={!!shipData?.locatario?.nombre}
                        disabled={!shipData?.locatario?.nombre}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AutocompleteComponent
                        value={getValue({
                            options: tenantCities,
                            id: shipData?.locatario?.idCiudad
                        })}
                        required={!!shipData?.locatario?.nombre}
                        disabled={!shipData?.locatario?.idPais}
                        onChange={(value: { id: number }) =>
                            setShipData({
                                ...shipData,
                                locatario: {
                                    ...shipData?.locatario,
                                    idCiudad: value?.id
                                }
                            })
                        }
                        readOnly={!!shipData?.locatario?.id}
                        name="idCiudad_locatario"
                        label="Ciudad"
                        options={tenantCities || []}
                        loading={isLoading}
                    />
                </Grid>
                <Grid container item justifyContent="space-between" xs={12} sm={6}>
                    <Grid item xs={5}>
                        <DatePickerComponent
                            required={!!shipData?.locatario?.nombre}
                            value={shipData?.locatario?.fechaDesde || ''}
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
                            errors={!_.isEmpty(errors) && errors}
                            disabled={!shipData?.locatario?.nombre}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <DatePickerComponent
                            required={!!shipData?.locatario?.nombre}
                            disabled={!shipData?.locatario?.fechaDesde}
                            value={shipData?.locatario?.fechaHasta || ''}
                            name="fechaHasta"
                            label="Vencimiento de locación"
                            setValue={(value: any) => {
                                const fechaHasta = new Date(value);
                                const fechaDesde = new Date(shipData?.locatario?.fechaDesde);
                                if (fechaHasta < fechaDesde) {
                                    return setErrors({
                                        fechaHasta:
                                            'Fecha fin de locación debe ser mayor que fecha de inicio de locación'
                                    });
                                } else {
                                    let auxError = { ...errors };
                                    delete auxError?.fechaHasta;
                                    setErrors(auxError);
                                    handleChange(
                                        {
                                            target: {
                                                name: 'fechaHasta',
                                                value: value
                                            }
                                        },
                                        'locatario'
                                    );
                                }
                            }}
                            width="100%"
                            errors={!_.isEmpty(errors) && errors}
                            helperText={!_.isEmpty(errors) && errors['fechaHasta']}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default TenantForm;
