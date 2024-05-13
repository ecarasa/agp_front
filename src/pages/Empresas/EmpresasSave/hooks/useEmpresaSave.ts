import { enqueueSnackbar } from 'notistack';
import { handleErrors } from '../../../../utils/common';
import { showAlert } from '../../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useGetCitiesByCountryIdQuery, useGetCountriesQuery } from '../../../../services/shipsApi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
    useCreateEmpresaMutation,
    useGetParametricDataQuery
} from '../../../../services/companyApi';

interface CategoriaFiscal {
    id: string;
    nombre: string;
    codigo: string;
}

export interface Body {
    nombreComercial: string;
    nombre: string;
    pais: number;
    ciudad: number;
    idFiscal: string;
    email: string;
    telefono: string;
    idEmpresa: number;
    idsRol: number[];
}

interface Perfiles {
    id: string;
    nombre: string;
}

type ValueProps = {
    options: [];
    id?: number;
    nombre?: string;
};

function useUserSave() {
    const [dataFiscal, setDataFiscal] = useState<CategoriaFiscal | null>(null);
    const [dataPerfiles, setDataPerfiles] = useState<Perfiles[]>([]);
    const [errors, setErrors] = useState<any>(null);
    const [propertyData, setPropertyData] = useState<any>({ idCiudad: 0, idPais: 0 });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { data } = useGetParametricDataQuery();
    const { data: countries, isLoading: loadingCountries } = useGetCountriesQuery({});
    const {
        data: citiesByCountryId,
        isLoading: loadingCities,
        isFetching: fetchingCities
    } = useGetCitiesByCountryIdQuery(propertyData?.idPais, { skip: !propertyData?.idPais });

    const companyOptionsPerfiles = data?.perfiles;
    const companyOptionsFiscales = data?.categoriasFiscales;
    const organizationOptions = data?.organizaciones;

    const [createEmpresa, { isLoading: creatingCompany }] = useCreateEmpresaMutation();
    const [valuesForm, setValuesForm] = useState({
        nombre: '',
        nombreComercial: '',
        idCategoriaFiscal: 1,
        identificacionFiscal: '',
        domicilio: '',
        email: '',
        telefono: '',
        idPais: 0,
        idCiudad: 0,
        idsOrganizacion: [],
        activo: true
    });

    const removeKey = (key: string) => {
        let auxObject = { ...errors };
        delete auxObject?.[key];
        setErrors(auxObject);
    };

    const handleChange = (event: any) => {
        event.preventDefault();
        if (event.target.id === 'email') {
            if (!isValidEmail(event.target.value)) {
                setErrors({
                    ...errors,
                    [event.target.name]: {
                        ...errors?.[event.target.name],
                        msg: 'Mail inválido'
                    }
                });
            } else {
                removeKey(event.target.name);
            }
        }
        if (event.target.id === 'telefono') {
            if (validatePhoneNumber(event.target.value)) {
                setErrors({
                    ...errors,
                    [event.target.name]: {
                        ...errors?.[event.target.name],
                        msg: 'Formato incorrecto'
                    }
                });
            } else {
                removeKey(event.target.name);
            }
        }
        setValuesForm({ ...valuesForm, [event.target.name]: event.target.value });
    };

    const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

    const validatePhoneNumber = (number: string) => isNaN(+number);

    const getValue = ({ options, id, nombre }: ValueProps) =>
        options?.find((i: any) => i.id === id || i.nombre === nombre) || null;

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const idPerfiles = dataPerfiles?.map((obj) => obj.id);
        if (
            valuesForm.nombre === '' ||
            valuesForm.nombreComercial === '' ||
            valuesForm.identificacionFiscal === '' ||
            valuesForm.domicilio === '' ||
            valuesForm.email === '' ||
            valuesForm.telefono === '' ||
            !propertyData.idPais ||
            !propertyData.idCiudad ||
            dataFiscal === null
        ) {
            enqueueSnackbar('Debes completar los campos obligatorios', { variant: 'error' });
            return false;
        }
        if (idPerfiles.length === 0) {
            enqueueSnackbar('Debes ingresar al menos un perfil', { variant: 'error' });
            return false;
        }
        if (validatePhoneNumber(valuesForm?.telefono)) {
            enqueueSnackbar('Ingresa un teléfono válido', { variant: 'error' });
            return false;
        }
        if (!isValidEmail(valuesForm?.email)) {
            enqueueSnackbar('Ingresa un mail válido', { variant: 'error' });
            return false;
        }

        const body: any = {
            nombre: valuesForm.nombre,
            nombreComercial: valuesForm.nombreComercial,
            idCategoriaFiscal: dataFiscal.id,
            identificacionFiscal: valuesForm.identificacionFiscal,
            domicilio: valuesForm.domicilio,
            email: valuesForm.email,
            telefono: valuesForm.telefono,
            idPais: propertyData.idPais,
            idCiudad: propertyData.idCiudad?.id,
            idPerfiles: dataPerfiles.map((p) => parseInt(p.id)),
            idsOrganizacion: valuesForm?.idsOrganizacion?.map((i: any) => parseInt(i?.id)),
            activo: true
        };

        try {
            const response: any = await createEmpresa(body);
            if (response?.statusCode > 400 || response?.error) {
                handleErrors(response?.error);
            } else {
                dispatch(
                    showAlert({
                        title: 'Empresa creada exitosamente',
                        confirmText: 'Cerrar',
                        confirmAction: () => navigate('/agp/empresas')
                    })
                );
            }
        } catch (error) {
            console.error('Error');
            return false;
        }
    };

    return {
        dataFiscal,
        dataPerfiles,
        countries,
        loadingCountries,
        valuesForm,
        creatingCompany,
        companyOptionsPerfiles,
        companyOptionsFiscales,
        errors,
        organizationOptions,
        fetchingCities,
        citiesByCountryId,
        loadingCities,
        propertyData,
        setPropertyData,
        setErrors,
        setDataFiscal,
        setDataPerfiles,
        handleChange,
        handleSubmit,
        setValuesForm,
        getValue
    };
}

export default useUserSave;
