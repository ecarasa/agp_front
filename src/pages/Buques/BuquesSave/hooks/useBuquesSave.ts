import _, { debounce } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { handleErrors } from '../../../../utils/common';
import { selectCurrentUser } from '../../../../features/auth/authSlice';
import { showAlert } from '../../../../features/slices/applicationSlice';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchs from './useFetchs';

export interface OwnerProps {
    armador?: boolean;
    locatario?: boolean;
}

const useBuquesSave = () => {
    const user = useAppSelector(selectCurrentUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [shipData, setShipData] = useState<any>({});
    const [searchInput, setSearchInput] = useState<any>('');
    const [activeStep, setActiveStep] = useState(1);
    const [assemblerCities, setAssemblerCities] = useState<any>();
    const [tenantCities, setTenantCities] = useState<any>();
    const [errors, setErrors] = useState<any>(null);
    const [selectedCountries, setSelectedCountries] = useState<any>();
    const [perfilAM, setPerfilAM] = useState<boolean>(false);
    const [ownersData, setOwnersData] = useState<OwnerProps>({ armador: false, locatario: false });

    const {
        agencies,
        getCitiesByCountryId,
        loadingCities,
        fetchingCities,
        loadingCountries,
        loadingParametricData,
        saveShip,
        shipDataValidation,
        verifyingData,
        ...fetchProps
    } = useFetchs();

    useEffect(() => {
        if (user) {
            setPerfilAM(user?.empresa?.tienePerfilAgenciaMaritima);
            const exist = agencies?.find((i: any) => i.id === user?.empresa?.id);
            if (exist) {
                setShipData({
                    ...shipData,
                    idAgenciaMaritima: { id: user?.empresa?.id, nombre: user?.empresa?.nombre }
                });
            }
        }
        // eslint-disable-next-line
    }, [user, agencies]);

    const getCities = async (id: number, user: string) => {
        try {
            const response = await getCitiesByCountryId(id);
            if (response) {
                if (user === 'armador') setAssemblerCities(response?.data?.ciudades);
                else setTenantCities(response?.data?.ciudades);
                setSelectedCountries({
                    ...selectedCountries,
                    [user]: { idPais: shipData?.[user]?.idPais }
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (
            (!assemblerCities && !!shipData?.armador?.idPais) ||
            (selectedCountries?.armador?.idPais !== shipData?.armador?.idPais &&
                !!shipData?.armador?.idPais)
        ) {
            getCities(shipData?.armador?.idPais, 'armador');
        }
        if (
            (!tenantCities && !!shipData?.locatario?.idPais) ||
            (selectedCountries?.locatario?.idPais !== shipData?.locatario?.idPais &&
                !!shipData?.locatario?.idPais)
        ) {
            getCities(shipData?.locatario?.idPais, 'locatario');
        }
        // eslint-disable-next-line
    }, [shipData]);

    const handleChange = (e: any, type?: string) => {
        if (type === 'autoselect') {
            if (!e?.id) {
                let newShipData = { ...shipData };
                delete newShipData[e.user];
                setShipData(newShipData);
            } else {
                setSearchInput('');
                setShipData({
                    ...shipData,
                    [e.user]: {
                        ...shipData[e.user],
                        nombre: e?.nombre || '',
                        domicilio: e?.domicilio || '',
                        idPais: e?.idPais || null,
                        idCiudad: e?.idCiudad || null,
                        telefono: e?.telefono || '',
                        id: e?.id || null,
                        esAlta: false
                    }
                });
            }
        } else if (type === 'checkbox') {
            const { checked, name }: any = e.target;
            setShipData({
                ...shipData,
                [name]: checked
            });
        } else {
            const { value, name }: any = e.target;
            if (!value && type) {
                let auxData: any = { ...shipData };
                delete auxData[type][name];
                setShipData(auxData);
            } else {
                setShipData(() => {
                    if (type) {
                        return {
                            ...shipData,
                            [type]: {
                                ...shipData[type],
                                [name]: value
                            }
                        };
                    } else {
                        return {
                            ...shipData,
                            [name]: value
                        };
                    }
                });
            }
        }
    };

    const handleSubmit = async () => {
        const data = {
            ...shipData,
            esloraMaxima: Number(shipData?.esloraMaxima),
            capacidadMaximaPasajeros: Number(shipData?.capacidadMaximaPasajeros),
            capacidadMaximaTEU: Number(shipData?.capacidadMaximaTEU),
            caladoConstruccion: Number(shipData?.caladoConstruccion),
            puntal: Number(shipData?.puntal),
            trb: Number(shipData?.trb),
            trn: Number(shipData?.trn),
            manga: Number(shipData?.manga)
        };

        if (user?.empresa?.tienePerfilAgenciaMaritima) {
            data.idAgenciaMaritima = user?.empresa?.id;
        } else {
            data.idAgenciaMaritima = shipData?.idAgenciaMaritima?.id;
        }

        if (!data?.capacidadMaximaTEU && !data?.capacidadMaximaPasajeros) {
            setErrors({
                capacidadMaximaTEU: !data?.capacidadMaximaPasajeros ? 'Debe asignar un valor' : '',
                capacidadMaximaPasajeros: !data?.capacidadMaximaTEU ? 'Debe asignar un valor' : ''
            });
            return enqueueSnackbar('Debe completar campo TEU ó Capacidad máxima de pasajeros', {
                variant: 'error'
            });
        } else {
            setErrors(null);
        }
        if (!data?.locatario?.nombre) delete data.locatario;
        if (
            data?.locatario?.nombre &&
            (!data?.locatario.fechaDesde || !data?.locatario.fechaHasta)
        ) {
            setErrors({
                fechaDesde: !data?.locatario.fechaDesde ? 'Debe asignar una fecha' : '',
                fechaHasta: !data?.locatario.fechaHasta ? 'Debe asignar una fecha' : ''
            });
            setActiveStep(1);
            return enqueueSnackbar('Debe completar campo fecha de locatario', {
                variant: 'error'
            });
        }
        if (data?.ignoreIMO) delete data.numeroIMO;
        delete data?.ignoreIMO;

        try {
            const response: any = await saveShip(data);

            if (response?.error) {
                handleErrors(response?.error);
                if (
                    response?.error?.data?.message.includes('armador') ||
                    response?.error?.data?.message.includes('locatario')
                ) {
                    setActiveStep(1);
                }
            } else {
                dispatch(
                    showAlert({
                        confirmText: 'Cerrar',
                        title: 'Buque dado de alta exitosamente',
                        keepMounted: true,
                        confirmAction: navigate,
                        itemData: -1
                    })
                );
            }
        } catch (error: any) {
            console.error(error);
        }
    };

    type ValueProps = {
        options: [];
        id?: number;
        nombre?: string;
    };
    const getValue = ({ options, id, nombre }: ValueProps) =>
        options?.find((i: any) => i.id === id || i.nombre === nombre) || null;

    const validateData = async () => {
        const data = {
            nombreBuque: shipData.nombre,
            numeroIMO: !shipData?.ignoreIMO ? shipData.numeroIMO : null,
            matricula: shipData.matricula,
            bandera: shipData.idPais,
            ...(shipData?.mmsi && { mmsi: shipData.mmsi }),
            ...(shipData?.senialDistintiva && { senialDistintiva: shipData.senialDistintiva })
        };

        let verification: string = '';
        try {
            const response: any = await shipDataValidation(data);

            const hasError = !!_.values(response?.data?.data).find((i: any) => !!i);
            if (hasError) {
                const { matriculaBandera, numeroIMO, nombreBuque, senialDistintiva, mmsi } =
                    response?.data?.data;
                if (nombreBuque && !matriculaBandera && !numeroIMO && !senialDistintiva && !mmsi) {
                    verification = 'nameExist';
                    return verification;
                }
                verification = 'err';

                setErrors({
                    //nombre: nombreBuque || '',
                    numeroIMO: numeroIMO || '',
                    matricula: matriculaBandera || '',
                    bandera: matriculaBandera || '',
                    senialDistintiva: senialDistintiva || '',
                    mmsi: mmsi || ''
                });
                Object.values(response?.data?.data).forEach((value: any) => {
                    if (value) enqueueSnackbar(value, { variant: 'error' });
                });
            } else if (response?.error) {
                if (Array.isArray(response?.error)) {
                    response?.error?.data?.message.forEach((item: any) => {
                        if (item.includes('senialDistintiva')) {
                            setErrors({
                                senialDistintiva: 'Debe contener números y letras sin espacios'
                            });
                            verification = 'err';
                        }
                    });
                }
            } else {
                setErrors(null);
            }
        } catch (e) {
            console.error(e);
        }
        return verification;
    };

    const debounceSearch = debounce(setSearchInput, 1300);

    useEffect(() => {
        return () => debounceSearch.cancel();
    }, [debounceSearch]);

    let isLoading = verifyingData || loadingParametricData || loadingCities || fetchingCities;

    const handleChangeOwnersData = (e: any) => {
        const { name, value } = e?.target;

        let auxData = { ...shipData };

        if (name === 'nuevo') {
            auxData[value] = { esAlta: true };
        } else {
            delete auxData[value];
        }
        setShipData(auxData);
        setOwnersData({ ...ownersData, [value]: name === 'nuevo' });
    };

    return {
        agencies,
        perfilAM,
        activeStep,
        assemblerCities,
        loadingCountries,
        tenantCities,
        errors,
        shipData,
        isLoading,
        searchInput,
        verifyingData,
        debounceSearch,
        selectedCountries,
        ownersData,
        setOwnersData,
        getValue,
        getCities,
        setErrors,
        setShipData,
        validateData,
        handleSubmit,
        handleChange,
        setActiveStep,
        setSearchInput,
        setSelectedCountries,
        handleChangeOwnersData,
        ...fetchProps
    };
};

export default useBuquesSave;
