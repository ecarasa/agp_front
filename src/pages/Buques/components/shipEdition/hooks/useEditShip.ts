import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { INTEGERS_OR_THREE_DECIMALS } from '../../../../../constants/regex';
import { showAlert } from '../../../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../../../hooks/reduxHooks';
import { handleErrors } from '../../../../../utils/common';
import { OwnerProps } from '../../../BuquesSave/hooks/useBuquesSave';
import useFetchs from './useFetchs';

type ValueProps = {
    options: [];
    id?: number;
    nombre?: string;
};
const useEditShips = ({ open, shipFullData }: any) => {
    const dispatch = useAppDispatch();
    const [modifiedValues, setModifiedValues] = useState<any>({});
    const [errors, setErrors] = useState<any>(null);
    const [shipInfo, setShipInfo] = useState<any>(null);
    const [shipDimensions, setShipDimensions] = useState<any>(null);
    const [propertyData, setPropertyData] = useState<any>(null);

    useEffect(() => {
        if (!!open && shipFullData) {
            if (open === 'shipInfo') {
                setShipInfo({
                    nombre: shipFullData?.nombre,
                    numeroIMO: shipFullData?.imo || '',
                    idPais: shipFullData?.idPais,
                    senialDistintiva: shipFullData?.senalDistintiva,
                    idAgenciaMaritima: shipFullData?.agenciaMaritima,
                    mmsi: shipFullData?.mmsi,
                    matricula: shipFullData?.matricula,
                    idTipoEmbarcacion: shipFullData?.tipoBuque
                });
            }
            if (open === 'measurementsInfo') {
                setShipDimensions({
                    puntal: shipFullData?.puntal,
                    manga: shipFullData?.manga,
                    capacidadMaximaPasajeros: shipFullData?.maximoPasajeros,
                    caladoConstruccion: shipFullData?.calado,
                    trb: shipFullData?.trb,
                    trn: shipFullData?.trn,
                    esloraMaxima: shipFullData?.esloraMaxima,
                    capacidadMaximaTEU: shipFullData?.maximoTeus
                });
            }
            if (open === 'assemblerTenantinfo') {
                setPropertyData({
                    armador: shipFullData.armador,
                    ...(!_.isEmpty(shipFullData?.locatario) && {
                        locatario: shipFullData.locatario
                    })
                });
            }
        }
    }, [open, shipFullData]);

    const [shipAssembler, setShipAssembler] = useState<any>(shipFullData?.armador || null);
    const [shipTenant, setShipTenant] = useState<any>(shipFullData?.locatario || null);
    const [ownersData, setOwnersData] = useState<OwnerProps>({
        armador: false,
        locatario: false
    });
    const [assemblerCities, setAssemblerCities] = useState<any>();
    const [tenantCities, setTenantCities] = useState<any>();
    const [selectedCountries, setSelectedCountries] = useState<any>();

    const { getCitiesByCountryId, editShip, shipDataValidation, ...fetchProps } = useFetchs();

    const getCities = async (id: number, user: string) => {
        try {
            const response = await getCitiesByCountryId(id);
            if (response) {
                if (user === 'armador') setAssemblerCities(response?.data?.ciudades);
                else setTenantCities(response?.data?.ciudades);
                setSelectedCountries({
                    ...selectedCountries,
                    [user]: { idPais: shipInfo?.[user]?.idPais }
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (
            !!propertyData?.armador?.idPais &&
            ((!assemblerCities && !!propertyData?.armador?.idPais) ||
                assemblerCities[0]?.idPais !== propertyData?.armador?.idPais)
        ) {
            getCities(propertyData?.armador?.idPais, 'armador');
        }
        if (
            !!propertyData?.locatario?.idPais &&
            ((!tenantCities && !!propertyData?.locatario?.idPais) ||
                tenantCities[0]?.idPais !== propertyData?.locatario?.idPais)
        ) {
            getCities(propertyData?.locatario?.idPais, 'locatario');
        }
        // eslint-disable-next-line
    }, [propertyData]);

    const handleChangeShipInfo = (e?: any) => {
        const { name, value } = e?.target;

        let formattedName = name;
        if (name === 'numeroIMO') formattedName = 'imo';
        if (name === 'senialDistintiva') formattedName = 'senalDistintiva';
        if (name === 'idAgenciaMaritima') formattedName = 'agenciaMaritima';
        if (name === 'idTipoEmbarcacion') formattedName = 'tipoBuque';

        if (
            _.isEqual(value, shipFullData[formattedName]) ||
            (value?.hasOwnProperty('id') && value?.id === shipFullData?.[formattedName]?.id)
        ) {
            let newObject = { ...modifiedValues };
            delete newObject[name];
            setModifiedValues(newObject);
        } else {
            setModifiedValues({
                ...modifiedValues,
                [name]: value
            });
        }
        setShipInfo({
            ...shipInfo,
            [name]: value
        });
    };

    const handleChangeDimensions = (e?: any) => {
        const { name, value } = e?.target;
        const isEntiredNumber = ['capacidadMaximaTEU', 'capacidadMaximaPasajeros'].includes(name);

        if (
            (value?.length < 10 && INTEGERS_OR_THREE_DECIMALS.test(value)) ||
            (value === '' && !isNaN(Number(value))) ||
            isEntiredNumber
        ) {
            let formattedName: any = name;
            if (name === 'caladoConstruccion') formattedName = 'calado';
            if (name === 'capacidadMaximaPasajeros') formattedName = 'maximoPasajeros';

            if (Number(value) === shipFullData[formattedName]) {
                let newObject = { ...modifiedValues };
                delete newObject[name];
                setModifiedValues(newObject);
            } else {
                setModifiedValues({
                    ...modifiedValues,
                    [name]: value
                });
            }
            setShipDimensions({
                ...shipDimensions,
                [name]: value
            });
        }
    };

    const getValue = ({ options, id, nombre }: ValueProps) =>
        options?.find((i: any) => i.id === id || i.nombre === nombre) || null;

    const handleSubmit = async (callback: any, section: string) => {
        let response: any;

        let body: any = {};
        if (section === 'info') {
            body = {
                ...modifiedValues,
                ...(modifiedValues?.idPais && { idPais: modifiedValues?.idPais }),
                ...(modifiedValues?.idTipoEmbarcacion && {
                    idTipoEmbarcacion: modifiedValues?.idTipoEmbarcacion?.id
                }),
                ...(modifiedValues?.idAgenciaMaritima && {
                    idAgenciaMaritima: modifiedValues?.idAgenciaMaritima?.id
                })
            };
        } else if (section === 'propertyData') {
            if (
                !_.isEqual(shipFullData.armador, propertyData?.armador) &&
                shipFullData?.armador?.id !== propertyData?.armador?.id
            ) {
                body = {
                    armador: propertyData?.armador
                };
            }
            if (
                !_.isEmpty(propertyData?.locatario) &&
                !_.isEqual(shipFullData?.locatario, propertyData?.locatario) &&
                propertyData?.locatario?.nombre
            ) {
                body = {
                    ...body,
                    locatario: {
                        ...propertyData?.locatario,
                        esAlta: !propertyData?.locatario?.hasOwnProperty('id')
                    }
                };
            }
        } else {
            Object.entries(modifiedValues).forEach(([key, value]: any) => {
                body[key] = Number(value);
            });
        }

        if (_.isEmpty(body)) return;

        try {
            const submit = async () => {
                response = await editShip({
                    data: body,
                    idBuque: shipFullData?.id
                });

                if (response) {
                    if (!response?.error) {
                        enqueueSnackbar('Datos editados correctamente', { variant: 'success' });
                        callback(false);
                    } else {
                        handleErrors(response?.error);
                    }
                }
                // callback(false);
            };

            if (section === 'info') {
                if (
                    !!Object.keys(modifiedValues).find((i: any) =>
                        ['numeroIMO', 'nombre', 'bandera', 'matricula'].includes(i)
                    )
                ) {
                    try {
                        const resValidation: any = await shipDataValidation({
                            isEdicion: true,
                            ...(modifiedValues?.nombre && { nombreBuque: modifiedValues?.nombre }),
                            ...(modifiedValues?.numeroIMO && {
                                numeroIMO: modifiedValues?.numeroIMO
                            }),
                            ...(modifiedValues?.bandera && {
                                bandera: modifiedValues?.idPais,
                                matricula: shipInfo?.matricula
                            }),
                            ...(modifiedValues?.matricula && {
                                matricula: modifiedValues?.matricula,
                                bandera: modifiedValues?.idPais || shipInfo?.idPais
                            })
                        });
                        const hasError = !!_.values(resValidation?.data?.data).find(
                            (i: any) => !!i
                        );
                        if (hasError) {
                            const { matriculaBandera, numeroIMO, nombreBuque } =
                                resValidation?.data?.data;
                            if (nombreBuque) {
                                dispatch(
                                    showAlert({
                                        title: '¡El nombre del buque ya existe!',
                                        message: '¿Desea continuar con la edición de los datos?',
                                        confirmText: 'Continuar',
                                        confirmAction: submit,
                                        cancelText: 'Cancelar'
                                    })
                                );
                            } else {
                                setErrors({
                                    numeroIMO: numeroIMO || '',
                                    matricula: matriculaBandera || '',
                                    bandera: matriculaBandera || ''
                                });
                            }
                        } else {
                            submit();
                        }
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    submit();
                }
            } else {
                submit();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const getDisableState = useCallback(() => {
        if (_.isEmpty(modifiedValues)) return true;
        else return false;
        // eslint-disable-next-line
    }, [shipInfo, modifiedValues]);

    const handleChange = (e: any, type?: string) => {
        if (type === 'autoselect') {
            if (!e?.id) {
                let newShipData = { ...propertyData };
                delete newShipData[e.user];
                setPropertyData(newShipData);
            } else {
                setPropertyData({
                    ...propertyData,
                    [e.user]: {
                        ...propertyData[e.user],
                        nombre: e?.nombre || '',
                        domicilio: e?.domicilio || '',
                        idPais: e?.idPais || null,
                        idCiudad: e?.idCiudad || null,
                        telefono: e?.telefono || '',
                        id: e?.id || null,
                        esAlta: false,
                        ...(e?.user === 'locatario' && { fechaDesde: '' }),
                        ...(e?.user === 'locatario' && { fechaHasta: '' })
                    }
                });
            }
        } else {
            const { value, name }: any = e.target;
            setPropertyData(() => {
                if (type) {
                    if (!value) {
                        let auxObject = { ...propertyData };
                        delete auxObject[type][name];
                        return auxObject;
                    } else
                        return {
                            ...propertyData,
                            [type]: {
                                ...propertyData[type],
                                [name]: value
                            }
                        };
                } else {
                    return {
                        ...propertyData,
                        [name]: value
                    };
                }
            });
        }
    };

    const handleChangeOwnersData = (e: any) => {
        const { name, value } = e?.target;

        let auxData = { ...propertyData };

        if (name === 'nuevo') {
            auxData[value] = { esAlta: true };
        } else {
            delete auxData[value];
        }
        setPropertyData(auxData);
        setOwnersData({ ...ownersData, [value]: name === 'nuevo' });
    };

    const getPropertyValidation = useCallback(() => {
        return (
            (shipFullData?.armador?.id === propertyData?.armador?.id &&
                shipFullData?.locatario?.id === propertyData?.locatario?.id &&
                _.isEqual(shipFullData.locatario, propertyData?.locatario)) ||
            (!_.isEmpty(propertyData?.locatario) && !propertyData?.locatario?.nombre) ||
            (shipFullData?.locatario?.id && !propertyData?.locatario?.nombre)
        );
    }, [shipFullData, propertyData]);

    return {
        errors,
        shipInfo,
        shipTenant,
        propertyData,
        shipAssembler,
        shipDimensions,
        assemblerCities,
        tenantCities,
        ownersData,
        getValue,
        handleSubmit,
        handleChange,
        setShipTenant,
        handleChangeOwnersData,
        getPropertyValidation,
        setPropertyData,
        getDisableState,
        setShipAssembler,
        handleChangeShipInfo,
        handleChangeDimensions,
        ...fetchProps
    };
};

export default useEditShips;
