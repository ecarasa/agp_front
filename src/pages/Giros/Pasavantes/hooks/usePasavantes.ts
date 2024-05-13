import _ from 'lodash';
import { downloadBase64File, downloadFile, handleErrors } from '../../../../utils/common';
import { enqueueSnackbar } from 'notistack';
import { hideAlert, showAlert } from '../../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetchs from './useFetchs';
import useGlobalFilters from '../../../../hooks/useGlobalFilters';
import useGlobalPasavantes from '../../../../components/GestionPasavantes/hooks/useGlobalPasavantes';

function usePasavantes() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        handleDownloadCertificate,
        downloadingCertificate,
        isDocking,
        openShipDrawer,
        handleOpenDrawer,
        handleCloseDrawer,
        getRateCode
    } = useGlobalPasavantes();
    const { debounceSearch, filters, setFilters, ...filterProps } = useGlobalFilters();
    const [data, setData] = useState<any>(null);
    const [billing, setBilling] = useState<any>(null);
    // const [loading, setLoading] = useState<boolean>(false);
    const [reviewNote, setReviewNote] = useState<string>('');
    const [selectedItemFromAction, setSelectedItemFromAction] = useState<any>(null);
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const [openReviewNoteDrawer, setOpenReviewNoteDrawer] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<any>(null);

    const {
        dataGiros,
        loadingDataGiros,
        fetchinDataGiros,
        loadingCountries,
        countries,
        downloadingPasavantePDF,
        postingReviewNote,
        agencies,
        loadingData,
        fetchingData,
        assemblers,
        loadingAssemblers,
        liquidating,
        loadingAgencies,
        loadingRegistration,
        rateCodes,
        loadingRateCodes,
        downloadingAttachedFile,
        downloadPasavantePDF,
        getGiroById,
        downloadAttachedFile,
        postReviewNote,
        billingRegister,
        liquidateDocking
    } = useFetchs({
        id,
        openShipDrawer,
        filters
    });

    const loadData = async () => {
        try {
            const response: any = await getGiroById(id);
            if (!response?.error) {
                setData(response?.data);
            } else {
                handleErrors(response?.error);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const setRateCodes = () => {
        let auxData: { [key: string]: {}[] } = {};

        data?.movimientos?.forEach((item: any) => {
            auxData[item?.id] = item?.codigosTarifa?.map((ct: any) =>
                rateCodes.find((i: any) => i.id === ct?.id)
            );
        });

        return auxData;
    };

    const loadBillingData = () => {
        setBilling({
            usuarioLiquidacion: data?.usuarioLiquidacion,
            notaLiquidacion: data?.notaLiquidacion,
            docFactura: data?.docFactura,
            cotizacionDolar: data?.cotizacionDolar,
            fechaLiquidacion: data?.fechaLiquidacion,
            fechaEnvioLiquidacion: data?.fechaEnvioLiquidacion,
            nroFactura: data?.nroFactura,
            rateCodes: setRateCodes()
        });
    };

    useEffect(() => {
        if (id && !data) loadData();
        if (!_.isEmpty(data) && !billing && rateCodes) loadBillingData();
        // eslint-disable-next-line
    }, [id, data, rateCodes]);

    const handleClickAction = (e: any, item: any) => {
        setSelectedItemFromAction(item);
        setAnchorEl(e.currentTarget);
        setOpenMenu(true);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setOpenMenu(false);
    };

    const handleChange = (e: any) => {
        const { value, name, files } = e.target;

        if (!value) {
            const auxData = { ...billing };
            delete auxData[name];
            setBilling(auxData);
        } else {
            if (name === 'file') {
                if (files[0]?.type !== 'application/pdf') {
                    return handleErrors({ data: { message: 'Tipo de archivo no admitido' } });
                }
                setBilling({
                    ...billing,
                    [name]: files[0]
                });
            } else {
                setBilling({
                    ...billing,
                    [name]: value
                });
            }
        }
    };

    const handleCloseReviewNoteDrawer = () => {
        setOpenReviewNoteDrawer(false);
    };

    const getMovements = () => {
        const movimientos: { id: string; idsCodigosTarifa: number[] }[] = [];
        let auxObject: any = {};

        Object.entries(billing?.rateCodes).forEach(([key, value]: any) => {
            auxObject = {
                id: key,
                idsCodigoTarifa: value?.map((i: any) => i?.id)
            };

            movimientos.push(auxObject);
        });

        return movimientos;
    };

    const handleSave = async (hideModal?: boolean | undefined) => {
        try {
            const formData = new FormData();

            if (billing?.file) formData.append('file', billing.file);
            if (billing?.nroFactura) formData.append('nroFactura', billing.nroFactura);
            if (billing?.notaLiquidacion)
                formData.append('notaLiquidacion', billing.notaLiquidacion);
            if (billing?.cotizacionDolar)
                formData.append('cotizacionDolar', billing.cotizacionDolar);
            if (billing?.rateCodes) formData.append('movimientos', JSON.stringify(getMovements()));

            const response: any = await billingRegister({
                idGiro: data?.id,
                formData
            });

            if (!response?.error) {
                if (!hideModal) {
                    dispatch(
                        showAlert({
                            title: '¡Datos guardados exitosamente!',
                            keepMounted: true,
                            confirmText: 'Cerrar',
                            confirmAction: () => navigate(0)
                        })
                    );
                }
            } else {
                handleErrors(response?.error);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmitReview = async () => {
        try {
            const response: any = await postReviewNote({
                idGiro: data?.id,
                body: { nota: reviewNote }
            });
            if (!response?.error) {
                dispatch(
                    showAlert({
                        title: 'Solicitud enviada a revisión',
                        keepMounted: true,
                        confirmText: 'Cerrar',
                        confirmAction: () => navigate('/agp/giros/pasavantes')
                    })
                );
            } else {
                handleErrors(response?.error);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const getPorts = (type: string) => {
        let string = '';

        const auxPorts = data?.puertos?.filter((i: any) => i.tipo === type);

        if (!!auxPorts?.length) {
            auxPorts?.forEach((i: any, index: number) => {
                string += i.ciudad?.nombre + `${index + 1 === auxPorts?.length ? '' : ' / '}`;
            });
        }

        return string;
    };

    const downloadPasavante = async () => {
        try {
            await handleDownloadPasavantePDF();
        } catch (error) {
            console.error(error);
        } finally {
            navigate('/agp/giros/pasavantes');
        }
    };

    const openPDFDownloadModal = () => {
        dispatch(
            showAlert({
                title: '¿Deseas ver el PDF?',
                confirmAction: downloadPasavante,
                confirmText: 'Confirmar',
                cancelText: 'Cerrar',
                cancelAction: () => {
                    dispatch(hideAlert());
                    navigate('/agp/giros/pasavantes');
                },
                icon: 'info',
                keepMounted: true
            })
        );
    };

    const handleSubmit = async () => {
        await handleSave(true);
        const response: any = await liquidateDocking(id);
        if (!response?.error) {
            dispatch(
                showAlert({
                    title: '¡Liquidación exitosa!',
                    confirmText: 'Cerrar',
                    keepMounted: true,
                    confirmAction: openPDFDownloadModal
                })
            );
        } else {
            handleErrors(response?.error);
        }
    };

    const handleDownloadFile = async () => {
        try {
            const data = {
                idGiro: id,
                nroFactura: billing?.nroFactura
            };
            const response: any = await downloadAttachedFile(data);

            await fetch(response?.data?.presignedUrl)
                .then((response) => response.blob())
                .then((blob) => {
                    downloadFile({ blob, name: billing?.docFactura });
                });
        } catch (e) {
            console.error(e);
        }
    };

    const confirmAction = (action: string) => {
        if (action === 'finalizar') {
            return dispatch(
                showAlert({
                    title: '¿Desea finalizar la solicitud?',
                    keepMounted: true,
                    cancelText: 'Cancelar',
                    confirmText: 'Aceptar',
                    confirmAction: handleSubmit,
                    icon: 'info'
                })
            );
        }
        if (action === 'guardar') {
            return dispatch(
                showAlert({
                    title: '¿Desea guardar la información?',
                    keepMounted: true,
                    cancelText: 'Cancelar',
                    confirmText: 'Aceptar',
                    confirmAction: handleSave,
                    icon: 'info'
                })
            );
        }
        if (action === 'revision') {
            return dispatch(
                showAlert({
                    title: '¿Desea enviar a revisión?',
                    keepMounted: true,
                    cancelText: 'Cancelar',
                    confirmText: 'Aceptar',
                    icon: 'info',
                    confirmAction: () => setOpenReviewNoteDrawer(true)
                })
            );
        }
        if (action === 'descargar_adjunto') {
            handleDownloadFile();
        }
    };

    const handleDownloadPasavantePDF = async () => {
        try {
            const response: any = await downloadPasavantePDF(id);

            if (response?.error) {
                enqueueSnackbar(response?.error?.data?.message, { variant: 'error' });
            } else {
                downloadBase64File(response?.data, parseInt(id!), 'liquidacion-giro');
            }
        } catch (e) {
            enqueueSnackbar('Ocurrió un error.', { variant: 'error' });
        }
    };

    return {
        data,
        billing,
        filters,
        openMenu,
        anchorEl,
        dataGiros,
        rateCodes,
        loadingRateCodes,
        countries,
        downloadingCertificate,
        isDocking,
        loadingCountries,
        loadingData,
        fetchingData,
        openShipDrawer,
        downloadingAttachedFile,
        loadingDataGiros,
        fetchinDataGiros,
        debounceSearch,
        downloadingPasavantePDF,
        openReviewNoteDrawer,
        reviewNote,
        liquidating,
        assemblers,
        postingReviewNote,
        loadingAssemblers,
        loadingRegistration,
        agencies,
        loadingAgencies,
        selectedItemFromAction,
        handleDownloadPasavantePDF,
        handleDownloadCertificate,
        getRateCode,
        getPorts,
        setFilters,
        handleSave,
        handleChange,
        confirmAction,
        setReviewNote,
        handleCloseMenu,
        handleSubmitReview,
        handleOpenDrawer,
        handleCloseDrawer,
        handleClickAction,
        handleCloseReviewNoteDrawer,
        ...filterProps
    };
}

export default usePasavantes;
