import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useGetWaybillByIdQuery,
    useInternalMovementsMutation,
    useLazyDownloadWaybillFileQuery
} from '../../../../services/railwaysApi';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';
import { downloadBase64File, handleErrors } from '../../../../utils/common';
import { showAlert } from '../../../../features/slices/applicationSlice';

interface WagonProps {
    idVagon: string;
}

function useCartaPorteDetail() {
    const { id } = useParams();
    const userCompany = useAppSelector((state) => state?.auth?.user?.empresa);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [openCard, setOpenCard] = useState<boolean>(false);
    const [selected, setSelected] = useState<any>(null);
    const [wagonsToChangeState, setWagonsToChangeState] = useState<WagonProps[]>([]);
    const [downloadWaybillFile, { isLoading: downloadingWaybillFile }] =
        useLazyDownloadWaybillFileQuery();
    const [internalMove, { isLoading: movingWagons }] = useInternalMovementsMutation();

    const {
        data,
        isLoading: loadingWaybill,
        isFetching: fetchingWaybill
    } = useGetWaybillByIdQuery(id);

    const handleChangeWagonsToChangeState = (event: any, item: any) => {
        if (event?.target?.checked) {
            const auxWagons = [...wagonsToChangeState];
            auxWagons.push({ idVagon: item?.id });
            setWagonsToChangeState(auxWagons);
        } else {
            setWagonsToChangeState(
                wagonsToChangeState?.filter((i: any) => i?.idVagon !== item?.id)
            );
        }
    };

    const handleOpenCard = (item: any) => {
        setSelected(item);
        setOpenCard(true);
    };

    const handleCloseCard = () => {
        setSelected(null);
        setOpenCard(false);
    };

    const downloadFile = (id: string) => {
        const handleDownloadPDF = async () => {
            try {
                const response: any = await downloadWaybillFile(id);
                if (!response?.error) {
                    downloadBase64File(response?.data, Number(id), 'carta-de-porte');
                } else {
                    handleErrors(response?.error);
                }
            } catch (error) {
                console.error(error);
            }
        };

        dispatch(
            showAlert({
                title: '¿Deseas descargar el PDF?',
                confirmAction: handleDownloadPDF,
                confirmText: 'Confirmar',
                cancelText: 'Cerrar',
                icon: 'info',
                keepMounted: true
            })
        );
    };

    const handleMoveWagons = async () => {
        const response: any = await internalMove({
            waybillId: id,
            body: { detalle: wagonsToChangeState }
        });

        if (!response?.error) {
            dispatch(
                showAlert({
                    title: '¡Vagones enviados a terminal correctamente!',
                    keepMounted: true,
                    confirmText: 'Cerrar'
                })
            );
        } else {
            handleErrors(response?.error);
        }
    };

    const confirmAction = (action: string) => {
        if (action === 'mover') {
            return dispatch(
                showAlert({
                    title: '¿Desea enviar los vagones seleccionados a la terminal?',
                    icon: 'info',
                    keepMounted: true,
                    confirmText: 'Aceptar',
                    cancelText: 'Cancelar',
                    confirmAction: handleMoveWagons
                })
            );
        }
    };

    const disableCheckValidation = (item: any) => {
        return (
            item?.estado !== 'En Terminal' &&
            !['Control OK', 'Resuelto'].some((i: any) => i === item?.inspeccion?.estado)
        );
    };

    return {
        data,
        downloadingWaybillFile,
        fetchingWaybill,
        loadingWaybill,
        openCard,
        selected,
        movingWagons,
        userCompany,
        wagonsToChangeState,
        downloadFile,
        handleOpenCard,
        confirmAction,
        handleCloseCard,
        handleChangeWagonsToChangeState,
        disableCheckValidation
    };
}

export default useCartaPorteDetail;
