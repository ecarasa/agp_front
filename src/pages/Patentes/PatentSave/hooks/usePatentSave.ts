import { downloadBase64File, handleErrors } from '../../../../utils/common';
import { hideAlert, showAlert } from '../../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    useAddPatentMutation,
    useLazyDownloadPatentPDFQuery,
    useValidatePatentsMutation
} from '../../../../services/patentsApi';

export const yearOptions = () => {
    const newArray: any = [];
    const date = new Date();
    const currentYear = date.getFullYear();

    for (let i = 0; i < 16; i++) {
        newArray.push({ id: i + 1, value: currentYear + i });
    }
    return newArray;
};

function usePatentSave({ data, handleChange }: any) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [errors, setErrors] = useState<any>(null);
    const [shipAlert, setShipAlert] = useState<any>(null);
    const [addPatent, { isLoading: addingPatent }] = useAddPatentMutation();
    const [validateShipPatents, { isLoading: validatingPatent }] = useValidatePatentsMutation();
    const [downloadFile, { isLoading: downloadingPatentFile }] = useLazyDownloadPatentPDFQuery();

    const getDisabledQuarter = (item: any) => {
        const date = new Date();
        const currentYear = date.getFullYear();
        const currentQuarter = Math.floor((date.getMonth() + 3) / 3);

        if (data?.anio === currentYear && item.id < currentQuarter) return true;
        else return false;
    };

    useEffect(() => {
        const validateData = async () => {
            const response: any = await validateShipPatents({ idBuque: data?.buque?.id });
            setShipAlert({ id: data?.buque?.id, message: response?.data?.buque });
        };
        if (data?.buque && ((data?.buque?.id && !shipAlert) || data?.buque?.id !== shipAlert?.id)) {
            validateData();
        }
        if (shipAlert?.id && !data?.buque) setShipAlert(null);
        // eslint-disable-next-line
    }, [data]);

    useEffect(() => {
        if (data?.trimestre) {
            const date = new Date();
            if (data?.anio === date.getFullYear() && getDisabledQuarter({ id: data?.trimestre })) {
                handleChange({
                    target: {
                        name: 'trimestre',
                        value: ''
                    }
                });
            }
        }
        // eslint-disable-next-line
    }, [data]);

    const showPDFDialog = (id: number) => {
        const handleDownloadPDF = async () => {
            try {
                const response: any = await downloadFile(id);
                if (!response?.error) {
                    downloadBase64File(response?.data, id, 'patente');
                } else {
                    handleErrors(response?.error);
                }
            } catch (error) {
                console.error(error);
            } finally {
                navigate('/agp/patentes');
            }
        };

        dispatch(
            showAlert({
                title: '¿Deseas ver el PDF?',
                confirmAction: handleDownloadPDF,
                confirmText: 'Confirmar',
                cancelText: 'Cerrar',
                cancelAction: () => {
                    dispatch(hideAlert());
                    navigate('/agp/patentes');
                },
                icon: 'info',
                keepMounted: true
            })
        );
    };

    const handleSubmitPatent = async () => {
        const body = {
            idBuque: data.buque?.id,
            capitan: data.capitan,
            tripulacion: data.tripulacion,
            pasajeros: data.pasajeros || null,
            nota: data.nota || null,
            requiereServicios: data.requiereServicios || false,
            movimientos: data.movimientos?.map((i: any) => ({ idMuelle: i?.muelle?.idMuelle })),
            trimestre: data.trimestre,
            anio: data.anio
        };

        const response: any = await addPatent(body);

        if (!response?.error) {
            dispatch(
                showAlert({
                    title: '¡Solicitud de Patente creada exitosamente!',
                    confirmText: 'Cerrar',
                    confirmAction: showPDFDialog,
                    itemData: Number(response?.data?.data?.idPatente),
                    keepMounted: true
                })
            );
        } else {
            handleErrors(response?.error);
        }
    };

    return {
        shipAlert,
        addingPatent,
        validatingPatent,
        downloadingPatentFile,
        getDisabledQuarter,
        yearOptions,
        handleSubmitPatent
    };
}

export default usePatentSave;
