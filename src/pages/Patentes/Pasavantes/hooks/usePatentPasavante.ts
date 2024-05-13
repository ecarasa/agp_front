import _ from 'lodash';
import { downloadBase64File, downloadFile, handleErrors } from '../../../../utils/common';
import { enqueueSnackbar } from 'notistack';
import { hideAlert, showAlert } from '../../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useCallback, useEffect, useState } from 'react';
import { useGetPatentsQuery } from '../../../../services/patentsApi';
import { useNavigate, useParams } from 'react-router-dom';
import useFetchs from './useFetchs';
import useGlobalPasavantes from '../../../../components/GestionPasavantes/hooks/useGlobalPasavantes';

interface Props {
    filters?: object | undefined;
}

function usePatentPasavante({ filters }: Props) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [billing, setBilling] = useState<any>(null);
    const {
        isDocking,
        openShipDrawer,
        downloadingCertificate,
        handleOpenDrawer,
        handleCloseDrawer,
        getRateCode,
        handleDownloadCertificate
    } = useGlobalPasavantes();

    const {
        billingRegister,
        downloadAttachedFile,
        getPatentById,
        liquidatePatent,
        downloadPasavantePDF,
        liquidating,
        rateCodes,
        loadingRateCodes,
        countries,
        loadingCountries,
        loadingPatent,
        fetchingPatent,
        loadingRegistration,
        downloadingAttachedFile,
        downloadingPasavantePDF
    } = useFetchs({ openShipDrawer, id });

    const {
        data: patents,
        isLoading: loadingPatents,
        isFetching: fetchingPatents
    } = useGetPatentsQuery(
        { filters },
        { skip: _.isEmpty(filters), refetchOnMountOrArgChange: true }
    );

    const loadData = async () => {
        try {
            const response: any = await getPatentById(id);
            if (!response?.error) {
                setData(response?.data);
            } else {
                handleErrors(response?.error);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const loadBillingData = () => {
        setBilling({
            docFactura: data?.ultimoPeriodo?.docFactura,
            nroFactura: data?.ultimoPeriodo?.nroFactura,
            notaLiquidacion: data?.ultimoPeriodo?.notaLiquidacion,
            cotizacionDolar: data?.ultimoPeriodo?.cotizacionDolar?.toString(),
            idsCodigoTarifa: data?.ultimoPeriodo?.codigosTarifa,
            fechaEnvioLiquidacion: data?.ultimoPeriodo?.fechaEnvioLiquidacion
        });
    };

    useEffect(() => {
        if (id && !data) loadData();
        if (!_.isEmpty(data) && !billing) loadBillingData();
        // eslint-disable-next-line
    }, [id, data]);

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

    const getRateCodeIds = () => {
        if (!!billing?.idsCodigoTarifa?.length) {
            return billing.idsCodigoTarifa?.map((item: any) => item.id);
        }
    };

    const handleSave = async (hideModal: boolean | undefined) => {
        try {
            const formData = new FormData();
            if (billing?.file) formData.append('file', billing.file);

            if (billing?.nroFactura && billing?.nroFactura !== data?.ultimoPeriodo?.nroFactura) {
                formData.append('nroFactura', billing.nroFactura);
            }
            if (billing?.notaLiquidacion !== data?.ultimoPeriodo?.notaLiquidacion) {
                formData.append('notaLiquidacion', billing?.notaLiquidacion || '');
            }
            if (billing?.cotizacionDolar !== data?.ultimoPeriodo?.cotizacionDolar?.toString()) {
                formData.append('cotizacionDolar', billing?.cotizacionDolar || '');
            }
            if (
                billing?.idsCodigoTarifa &&
                !_.isEqual(
                    _.orderBy(billing?.idsCodigoTarifa, ['id'], ['asc']),
                    _.orderBy(data?.ultimoPeriodo?.codigosTarifa, ['id'], ['asc'])
                )
            ) {
                formData.append('idsCodigoTarifa', JSON.stringify(getRateCodeIds()));
            }

            const response: any = await billingRegister({
                patentId: data?.id,
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

    const downloadPasavante = async () => {
        try {
            await handleDownloadLiquidationPDF();
        } catch (error) {
            console.error(error);
        } finally {
            navigate('/agp/patentes/pasavantes');
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
                    navigate('/agp/patentes/pasavantes');
                },
                icon: 'info',
                keepMounted: true
            })
        );
    };

    const handleSubmit = async () => {
        await handleSave(true);
        const response: any = await liquidatePatent(id);
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

    const confirmAction = (action: string) => {
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
        if (action === 'descargar_adjunto') {
            return downloadAttachedPdfFile();
        }
    };

    const handleDownloadLiquidationPDF = async () => {
        try {
            const response: any = await downloadPasavantePDF(id);

            if (!response?.error) {
                downloadBase64File(response?.data, parseInt(id!), 'liquidacion-patente');
            } else {
                handleErrors(response.error);
            }
        } catch (e) {
            enqueueSnackbar('Ocurrió un error.', { variant: 'error' });
        }
    };

    const downloadAttachedPdfFile = async () => {
        const response: any = await downloadAttachedFile({
            patentId: id,
            billingNumber: billing?.nroFactura
        });
        if (!response?.error) {
            try {
                await fetch(response?.data)
                    .then((response) => response.blob())
                    .then((blob) => {
                        downloadFile({ blob, name: billing?.docFactura });
                    });
            } catch (e) {
                console.error(e);
            }
        } else {
            handleErrors(response?.error);
        }
    };

    const saveDataValidation = useCallback(() => {
        const auxData = {
            docFactura: data?.ultimoPeriodo?.docFactura,
            nroFactura: data?.ultimoPeriodo?.nroFactura,
            notaLiquidacion: data?.ultimoPeriodo?.notaLiquidacion,
            cotizacionDolar: data?.ultimoPeriodo?.cotizacionDolar?.toString(),
            idsCodigoTarifa: _.orderBy(data?.ultimoPeriodo?.codigosTarifa, ['id'], ['asc']),
            fechaEnvioLiquidacion: data?.ultimoPeriodo?.fechaEnvioLiquidacion
        };

        const auxBilling = {
            ...billing,
            idsCodigoTarifa: _.orderBy(billing?.idsCodigoTarifa, ['id'], ['asc'])
        };

        return _.isEqual(auxBilling, auxData);
    }, [billing, data]);

    return {
        billing,
        countries,
        data,
        downloadingAttachedFile,
        downloadingCertificate,
        downloadingPasavantePDF,
        fetchingPatent,
        fetchingPatents,
        filters,
        isDocking,
        liquidating,
        loadingCountries,
        loadingPatent,
        loadingPatents,
        loadingRateCodes,
        loadingRegistration,
        openShipDrawer,
        patents,
        rateCodes,
        saveDataValidation,
        handleDownloadLiquidationPDF,
        confirmAction,
        handleChange,
        getRateCode,
        handleCloseDrawer,
        handleOpenDrawer,
        downloadAttachedPdfFile,
        handleDownloadCertificate
    };
}

export default usePatentPasavante;
