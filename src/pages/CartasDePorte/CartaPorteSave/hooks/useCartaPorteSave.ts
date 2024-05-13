import _ from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { handleErrors } from '../../../../utils/common';
import { showAlert } from '../../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { waybillDetailFromApi } from '../adapters/cartasPorte';
import {
    useCreateWaybillMutation,
    useEditWaybillMutation,
    useGetCitiesQuery,
    useGetCompaniesQuery,
    useGetRailwayCompaniesQuery,
    useLazyGetWaybillByIdQuery
} from '../../../../services/railwaysApi';

function useCartaPorteSave() {
    const { id } = useParams();
    const adapter = waybillDetailFromApi;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(1);
    const [data, setData] = useState<any>(null);
    const [initialData, setInitialData] = useState<any>(null);
    const [modifiedWagons, setModifiedWagons] = useState<any>([]);
    const [errors, setErrors] = useState<any>(null);
    const { data: railwayCompanies, isLoading: loadingRailwayCompanies } =
        useGetRailwayCompaniesQuery({});
    const { data: companies, isLoading: loadingCompanies } = useGetCompaniesQuery({});
    const { data: cities, isLoading: loadingCities } = useGetCitiesQuery({});
    const [createWaybill, { isLoading: creatingWaybill }] = useCreateWaybillMutation();
    const [updateWaybill, { isLoading: updatingWaybill }] = useEditWaybillMutation();

    const [getWaybill, { isLoading: loadingWaybill, isFetching: fetchingWaybill }] =
        useLazyGetWaybillByIdQuery();

    const loadData = async () => {
        try {
            const response: any = await getWaybill(id);
            if (!response?.error) {
                setData(adapter(response?.data, cities));
                setInitialData(adapter(response?.data, cities));
            } else {
                handleErrors(response.error);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (id && !data && cities) loadData();
        // eslint-disable-next-line
    }, [id, cities, data]);

    const handleSubmit = async () => {
        try {
            const detalle = id ? modifiedWagons : data?.detalle;

            const body = {
                ...data,
                idOrigen: data?.idOrigen?.id,
                idDestino: data?.idDestino?.id,
                idLugarCarga: data?.idLugarCarga?.id,
                idLugarDescarga: data?.idLugarDescarga?.id,
                idCliente: data?.idCliente?.id,
                idCargador: data?.idCargador?.id,
                idConsignatario: data?.idConsignatario?.id,
                ...(data?.nota && { nota: data?.nota }),
                detalle: detalle?.map((item: any) => ({
                    nroVagon: item.nroVagon,
                    ...(item?.nroContenedor && { nroContenedor: item?.nroContenedor }),
                    ...(item?.descripcion && { descripcion: item?.descripcion }),
                    ...(item?.cantidadBultos && {
                        cantidadBultos: Number(item?.cantidadBultos)
                    }),
                    ...(item?.nroPrecinto && { nroPrecinto: item?.nroPrecinto }),
                    ...(item?.colorPrecinto && { colorPrecinto: item?.colorPrecinto }),
                    ...(item?.pesoAforo && { pesoAforo: Number(item?.pesoAforo) }),
                    ...(item?.pesoVerificado && {
                        pesoVerificado: Number(item?.pesoVerificado)
                    }),
                    ...(item?.capacidadCarga && {
                        capacidadCarga: Number(item?.capacidadCarga)
                    }),
                    ...(id && { accion: item?.accion }),
                    ...(id && item?.accion === 'E' && { id: item?.id })
                }))
            };

            let response: any = null;
            if (id) {
                response = await updateWaybill({ id, body });
            } else {
                response = await createWaybill(body);
            }

            if (!response?.error) {
                dispatch(
                    showAlert({
                        title: `${id ? 'Edición' : 'Alta'} de Carta de Porte`,
                        message: `La carta de porte fue ${
                            id ? 'editada' : 'dada de alta'
                        } exitosamente.`,
                        keepMounted: true,
                        confirmText: 'Aceptar',
                        confirmAction: () => navigate('/agp/cartas-de-porte')
                    })
                );
            } else {
                dispatch(
                    showAlert({
                        title: `Error al ${id ? 'editar' : 'crear'} carta de porte`,
                        keepMounted: true,
                        confirmText: 'Cerrar',
                        icon: 'cancel'
                    })
                );
            }
        } catch (e) {
            console.error(e);
        }
    };

    const confirmSubmit = () => {
        if (!data?.detalle?.length)
            return enqueueSnackbar('No existe ningún vagón cargado', { variant: 'error' });
        dispatch(
            showAlert({
                title: `Confirmar ${id ? 'edición' : 'alta'} de carta de porte`,
                keepMounted: true,
                confirmText: 'Aceptar',
                cancelText: 'Cancelar',
                icon: 'info',
                confirmAction: handleSubmit
            })
        );
    };

    const handleAction = () => {
        if (activeStep === 1) setActiveStep(2);
        else handleSubmit();
    };

    const handleChangeData = (event: any) => {
        const { name, value, checked } = event?.target;

        if (name === 'object') {
            if (_.isNull(Object.entries(value)[0][1])) {
                let auxData = { ...data };
                Object.keys(value)?.forEach((key) => delete auxData[key]);
                setData(auxData);
            } else
                setData({
                    ...data,
                    ...value
                });
        } else {
            if (!value) {
                let auxData = { ...data };
                delete auxData[name];
                setData(auxData);
            } else {
                setData({
                    ...data,
                    [name]: (checked && checked) || value
                });
            }
        }
    };

    const handleEdit = (item: any, action: string) => {
        let auxArray: [any] = modifiedWagons;
        if (!item?.accion) {
            auxArray?.push({ ...item, accion: 'E' });
            setModifiedWagons(auxArray);
        } else if (item?.accion === 'A') {
            if (action === 'add') {
                auxArray?.push(item);
                setModifiedWagons(auxArray);
            } else {
                setModifiedWagons(auxArray?.filter((i: any) => Number(i.id) !== Number(item.id)));
            }
        }
    };

    return {
        id,
        activeStep,
        cities,
        initialData,
        companies,
        creatingWaybill,
        data,
        errors,
        fetchingWaybill,
        loadingCities,
        loadingCompanies,
        loadingRailwayCompanies,
        loadingWaybill,
        updatingWaybill,
        railwayCompanies,
        handleAction,
        handleEdit,
        handleChangeData,
        setActiveStep,
        confirmSubmit,
        setData,
        setErrors
    };
}

export default useCartaPorteSave;
