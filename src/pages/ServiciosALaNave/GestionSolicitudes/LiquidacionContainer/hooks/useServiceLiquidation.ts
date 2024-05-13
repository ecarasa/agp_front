import _ from 'lodash';
import { downloadFile, handleErrors } from '../../../../../utils/common';
import { showAlert } from '../../../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../../../hooks/reduxHooks';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useGetRateCodesQuery,
    useGetServiceRequestByIdQuery,
    useLazyDownloadAttachedFileQuery,
    useLiquidateServiceMutation
} from '../../../../../services/shipServiceApi';

function useServiceLiquidation() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [billing, setBilling] = useState<any>(null);
    const {
        data,
        isLoading: loadingRequestData,
        isFetching: fetchingRequestData
    } = useGetServiceRequestByIdQuery(id, { skip: !id });
    const { data: rateCodes, isLoading: loadingRateCodes } = useGetRateCodesQuery({});
    const [liquidateService, { isLoading: liquidatingService }] = useLiquidateServiceMutation();
    const [downloadAttachedFile, { isLoading: downloadingAttachedFile }] =
        useLazyDownloadAttachedFileQuery();

    const loadBillingData = () => {
        setBilling({
            docFactura: data?.liquidacion?.linkFactura,
            nroFactura: data?.liquidacion?.nroFactura,
            notaLiquidacion: data?.liquidacion?.nota,
            cotizacionDolar: data?.liquidacion?.cotizacionDolar,
            idsCodigoTarifa: data?.liquidacion?.tarifas,
            fechaEnvioLiquidacion: data?.liquidacion?.fechaLiquidacion
        });
    };

    useEffect(() => {
        if (!_.isEmpty(data) && !billing) loadBillingData();
        // eslint-disable-next-line
    }, [id, data]);

    const downloadAttachedPdfFile = async () => {
        const response: any = await downloadAttachedFile({
            requestId: id,
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

    const confirmAction = (action: string) => {
        if (action === 'descargar_adjunto') {
            return downloadAttachedPdfFile();
        }
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

    const handleSubmit = () => {
        const submit = async () => {
            const formData = new FormData();
            if (billing?.file) formData.append('file', billing.file);

            if (billing?.nroFactura) {
                formData.append('nroFactura', billing.nroFactura);
            }
            if (billing?.notaLiquidacion !== data?.ultimoPeriodo?.notaLiquidacion) {
                formData.append('nota', billing?.notaLiquidacion || '');
            }
            if (billing?.cotizacionDolar !== data?.ultimoPeriodo?.cotizacionDolar?.toString()) {
                formData.append('cotizacionDolar', billing?.cotizacionDolar || '');
            }
            if (billing?.idsCodigoTarifa) {
                const codes = billing.idsCodigoTarifa?.map((item: any) => item.id);
                formData.append('idsCodigoTarifa', JSON.stringify(codes));
            }

            const response: any = await liquidateService({
                requestId: data?.id,
                body: formData
            });

            if (!response?.error) {
                dispatch(
                    showAlert({
                        title: 'Solicitud de servicio liquidada correctamente',
                        keepMounted: true,
                        confirmText: 'Cerrar',
                        confirmAction: () => navigate(-1)
                    })
                );
            } else {
                handleErrors(response?.error);
            }
        };

        dispatch(
            showAlert({
                title: '¿Desea finalizar la solicitud de servicio?',
                keepMounted: true,
                cancelText: 'Cancelar',
                confirmText: 'Aceptar',
                confirmAction: submit,
                icon: 'info'
            })
        );
    };

    const getDisabledValidation = useCallback(() => {
        return (
            (billing?.file && (!billing?.nroFactura || !billing?.cotizacionDolar)) ||
            !billing?.cotizacionDolar
        );
    }, [billing]);

    return {
        billing,
        rateCodes,
        loadingRateCodes,
        data,
        loadingRequestData,
        fetchingRequestData,
        liquidatingService,
        downloadingAttachedFile,
        setBilling,
        confirmAction,
        handleChange,
        handleSubmit,
        getDisabledValidation
    };
}

export default useServiceLiquidation;
