import _ from 'lodash';
import { Box } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { handleErrors } from '../../../utils/common';
import { INTEGERS_UNIT } from '../../../constants/regex';
import { showAlert } from '../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useEditEmpresaMutation, useLazyGetEmpresaQuery } from '../../../services/companyApi';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AutocompleteComponent from '../../../components/layout/Autocomplete';
import ButtonActions from '../../../components/ButtonActions';
import Input from '../../../components/Input/Input';
import SectionHeader from '../../../components/SectionHeader';
import useEmpresaSave from '../EmpresasSave/hooks/useEmpresaSave';

const EmpresaDataForm = ({ setOpen, companyById }: any) => {
    const {
        countries,
        loadingCountries,
        errors,
        setErrors,
        companyOptionsFiscales,
        propertyData,
        setPropertyData,
        citiesByCountryId,
        getValue,
        loadingCities,
        fetchingCities
    } = useEmpresaSave();
    const { t } = useTranslation('userForm');

    const dispatch = useAppDispatch();

    const [editEmpresaData, { isLoading: edditingCompany }] = useEditEmpresaMutation();
    const [modifiedValues, setModifiedValues] = useState<any>(null);
    const [data, setData] = useState({
        ...companyById,
        categoriaFiscal: !_.isEmpty(companyById?.categoriaFiscal) ? companyById.categoriaFiscal : ''
    });

    const removeKey = (key: string) => {
        let auxObject = { ...errors };
        delete auxObject?.[key];
        setErrors(auxObject);
    };

    const checkErrors = ({ name, value }: any) => {
        if (name === 'email') {
            if (!isValidEmail(value)) {
                setErrors({ ...errors, [name]: { ...errors?.[name], msg: 'Mail inválido' } });
            } else {
                removeKey(name);
            }
        }
        if (name === 'telefono') {
            if (validatePhoneNumber(value)) {
                setErrors({ ...errors, [name]: { ...errors?.[name], msg: 'Formato incorrecto' } });
            } else {
                removeKey(name);
            }
        }
    };
    const handleChange = (e: any) => {
        const { name, value } = e?.target;
        if (value === companyById[name]) {
            let newObject = { ...modifiedValues };
            if (newObject[name]) delete newObject[name];
            setModifiedValues(newObject);
        } else {
            setModifiedValues({ ...modifiedValues, [name]: value });
        }
        setData({ ...data, [name]: value });
        checkErrors(e?.target);
    };

    const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
    const validatePhoneNumber = (number: string) => isNaN(+number);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (modifiedValues?.telefono && validatePhoneNumber(modifiedValues?.telefono)) {
            enqueueSnackbar('Ingresa un teléfono válido', { variant: 'error' });
            return false;
        }
        if (modifiedValues?.email && !isValidEmail(modifiedValues?.email)) {
            enqueueSnackbar('Ingresa un mail válido', { variant: 'error' });
            return false;
        }

        const body = {
            ...(modifiedValues?.nombre && { nombre: modifiedValues?.nombre }),
            ...(modifiedValues?.nombreComercial && {
                nombreComercial: modifiedValues.nombreComercial
            }),
            ...(modifiedValues?.categoriaFiscal && {
                idCategoriaFiscal: modifiedValues.categoriaFiscal?.id
            }),
            ...(modifiedValues?.identificacionFiscal && {
                identificacionFiscal: modifiedValues.identificacionFiscal
            }),
            ...(modifiedValues?.telefono && { telefono: modifiedValues.telefono }),
            ...(modifiedValues?.idPais && { idPais: propertyData?.idPais }),
            ...(modifiedValues?.idCiudad && { idCiudad: propertyData?.idCiudad?.id }),
            ...(modifiedValues?.domicilio && { domicilio: modifiedValues.domicilio }),
            ...(modifiedValues?.email && { email: modifiedValues.email }),
            ...(modifiedValues?.activo && { activo: modifiedValues.activo })
        };

        const response: any = await editEmpresaData({ body, idEmpresa: data.id });
        if (!response?.error) {
            setOpen('');
            dispatch(
                showAlert({
                    title: 'Empresa editada correctamente',
                    icon: 'success',
                    keepMounted: true,
                    confirmText: 'Aceptar'
                })
            );
        } else {
            handleErrors(response.error);
        }
    };

    useEffect(() => {
        if (!propertyData?.idPais && !propertyData?.idCiudad)
            setPropertyData({
                ...propertyData,
                idPais: data?.pais?.id,
                idCiudad: !_.isEmpty(data?.ciudad) ? data?.ciudad : ''
            });
        // eslint-disable-next-line
    }, [data]);

    return (
        <>
            <SectionHeader>
                <SectionHeader.DrawerTitle>Información de la Empresa</SectionHeader.DrawerTitle>
            </SectionHeader>
            <Box component="form" sx={{ padding: '10px' }} onSubmit={handleSubmit}>
                <Input
                    label="Nombre"
                    name="nombre"
                    value={data?.nombre}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Nombre Comercial"
                    name="nombreComercial"
                    value={data?.nombreComercial}
                    required
                    onChange={handleChange}
                />
                <AutocompleteComponent
                    name="idCategoriaFiscal"
                    value={data?.categoriaFiscal || ''}
                    onChange={(value: any) =>
                        handleChange({ target: { name: 'categoriaFiscal', value: value } })
                    }
                    options={companyOptionsFiscales || []}
                    label="Categoria Fiscal"
                    required
                />
                <Input
                    label="Identificación Fiscal"
                    name="identificacionFiscal"
                    required
                    value={data?.identificacionFiscal}
                    onChange={handleChange}
                />{' '}
                <Input
                    label="Domicilio"
                    name="domicilio"
                    required
                    value={data?.domicilio}
                    onChange={handleChange}
                />
                <Input
                    type="email"
                    label="Email"
                    name="email"
                    required
                    value={data?.email}
                    onChange={handleChange}
                />
                <Box sx={{ marginLeft: 0, color: '#f00' }}>{errors?.email?.msg}</Box>
                <Input
                    label="Teléfono"
                    name="telefono"
                    required
                    value={data?.telefono}
                    onChange={(e: any) => {
                        let value = e.target.value;
                        if ((INTEGERS_UNIT.test(value) || value === '') && value?.length < 25) {
                            handleChange(e);
                        }
                    }}
                />
                <Box sx={{ marginLeft: 0, color: '#f00' }}>{errors?.telefono?.msg}</Box>
                <AutocompleteComponent
                    value={getValue({
                        options: countries,
                        id: propertyData?.idPais
                    })}
                    onChange={(e: any) => {
                        setPropertyData({
                            ...propertyData,
                            idPais: e?.id,
                            idCiudad: ''
                        });
                        handleChange({ target: { name: 'idPais', value: e } });
                    }}
                    label={t('empresa.add.pais')}
                    errors={errors}
                    templateLabel={(option: any) => option.nombre}
                    options={countries || []}
                    loading={loadingCountries}
                    required
                />
                <AutocompleteComponent
                    value={propertyData?.idCiudad || ''}
                    onChange={(e: any) => {
                        setPropertyData({
                            ...propertyData,
                            idCiudad: e
                        });
                        handleChange({ target: { name: 'idCiudad', value: e } });
                    }}
                    name="idCiudad"
                    label={t('empresa.add.ciudad')}
                    options={citiesByCountryId?.ciudades || []}
                    loading={loadingCities || fetchingCities}
                    required
                />
                <Box sx={{ margin: '40px 0' }}>
                    <ButtonActions
                        renderBackAction
                        disabled={_.isEmpty(modifiedValues)}
                        returnText="Cerrar"
                        handleClose={() => setOpen(false)}
                        flexDirection="column-reverse"
                        loading={edditingCompany}
                    />
                </Box>
            </Box>
        </>
    );
};
export default EmpresaDataForm;
