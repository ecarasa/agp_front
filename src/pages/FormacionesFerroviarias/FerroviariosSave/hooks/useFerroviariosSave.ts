import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { hideAlert, showAlert } from '../../../../features/slices/applicationSlice';
import {
    useCreateRailwayMutation,
    useGetParrillasQuery,
    useGetRailwayCompaniesQuery,
    useLazyGetWaybillByIdQuery
} from '../../../../services/railwaysApi';
import _ from 'lodash';
import { handleErrors } from '../../../../utils/common';
import { useNavigate } from 'react-router-dom';

interface DataProps {
    ingreso?: any;
    idFerrocarril?: number | undefined;
    idParrilla?: ParrillaProps | undefined;
    maquinista?: string | undefined;
    nroLocomotora?: string | undefined;
    cartasPorte?: CartaPorteProps[] | undefined;
}

type ParrillaProps = {
    id: number;
    nombre: string;
};

type CartaPorteProps = {
    idCartaPorte: string;
    cantidadVagones: number;
    nroVia: number;
};

function useFerroviariosSave() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState<number>(1);
    const [searchInput, setSearchInput] = useState<string>('');
    const [data, setData] = useState<DataProps | null>(null);
    const [cartaPorte, setCartaPorte] = useState<any>(null);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const { data: railwayCompanies, isLoading: loadingRailwayCompanies } =
        useGetRailwayCompaniesQuery({});
    const { data: parrillas, isLoading: loadingParrillas } = useGetParrillasQuery({});
    const [getWaybill, { isLoading: loadingWaybill, isFetching: fetchingWaybill }] =
        useLazyGetWaybillByIdQuery();
    const [createRailway, { isLoading: submitting }] = useCreateRailwayMutation();

    const handleChange = (e: any) => {
        const { name, value } = e?.target;
        if (!value) {
            const auxData: any = { ...data };
            delete auxData[name];
            return setData(auxData);
        }
        setData({
            ...data,
            [name]: value
        });
    };

    const getCartaPorte = async () => {
        try {
            const response: any = await getWaybill(searchInput);
            if (!response?.error) {
                if (response?.data) {
                    if (response?.data?.totalVagonesPendientes < 1) {
                        dispatch(
                            showAlert({
                                title: `Carta de porte N° ${searchInput}`,
                                message: 'No existen vagones pendientes de ingreso',
                                keepMounted: true,
                                icon: 'info',
                                confirmText: 'Cerrar',
                                confirmAction: () => setSearchInput('')
                            })
                        );
                    } else {
                        setCartaPorte(response?.data);
                        setOpenDrawer(true);
                    }
                } else {
                    setSearchInput('');
                    dispatch(
                        showAlert({
                            title: 'Carta de porte inexistente',
                            keepMounted: true,
                            icon: 'info',
                            confirmText: 'Cerrar'
                        })
                    );
                }
            } else handleErrors(response?.error);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSearch = () => getCartaPorte();

    const handleCloseDrawer = () => {
        setOpenDrawer(false);
        setSearchInput('');
    };

    const handleSubmit = () => {
        const exit = () => {
            navigate('/agp/formaciones-ferroviarias');
        };

        const waybillAdded = () => {
            dispatch(
                showAlert({
                    title: '¡Alta de formación existosa!',
                    keepMounted: true,
                    confirmAction: exit
                })
            );
        };

        const submitRailway = async () => {
            try {
                const body = {
                    ...data,
                    ingreso: data?.ingreso === 'ingreso',
                    idParrilla: Number(data?.idParrilla?.id),
                    cartasPorte: data?.cartasPorte?.map((item: any) => ({
                        idCartaPorte: item?.idCartaPorte,
                        cantidadVagones: Number(item?.cantidadVagones),
                        nroVia: Number(item?.nroVia)
                    }))
                };

                const response: any = await createRailway({ body });
                if (!response.error) waybillAdded();
                else handleErrors(response?.error);
            } catch (e) {
                console.error(e);
            }
        };

        dispatch(
            showAlert({
                title: 'Dar de alta formación',
                keepMounted: true,
                icon: 'info',
                confirmAction: submitRailway,
                cancelText: 'Cancelar',
                cancelAction: () => dispatch(hideAlert())
            })
        );
    };

    const getDisabled = useCallback(() => {
        return (
            (activeStep === 2 && !data?.cartasPorte?.length) ||
            (activeStep === 1 && _.isUndefined(data?.ingreso))
        );
    }, [activeStep, data]);

    return {
        data,
        openDrawer,
        activeStep,
        cartaPorte,
        parrillas,
        loadingParrillas,
        railwayCompanies,
        loadingRailwayCompanies,
        searchInput,
        submitting,
        loadingWaybill,
        fetchingWaybill,
        setSearchInput,
        setActiveStep,
        handleChange,
        handleSearch,
        handleSubmit,
        handleCloseDrawer,
        getDisabled
    };
}

export default useFerroviariosSave;
