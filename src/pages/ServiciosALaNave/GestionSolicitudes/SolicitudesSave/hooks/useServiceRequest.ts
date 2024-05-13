import { handleErrors } from '../../../../../utils/common';
import { showAlert } from '../../../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../../../hooks/reduxHooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from './useFetch';

function useServiceRequest({ filters }: any) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);

    const { addServiceRequest, ...fetchProps } = useFetch({ filters });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        let auxData = { ...data };

        if (name === 'idBuque' && data?.idGiro) {
            delete auxData.idGiro;
            delete auxData?.idMuelle;
        }
        if (name === 'idGiro' && data?.idMuelle) {
            delete auxData.idMuelle;
        }
        if (name === 'idServicio' && data?.idPrestador) {
            delete auxData.idPrestador;
        }

        if (!value) {
            delete auxData[name];
            setData(auxData);
        } else {
            setData({
                ...auxData,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    useEffect(() => {
        if (data?.idServicio && data?.idServicio?.prestadores?.length === 1 && !data?.idPrestador) {
            setData({
                ...data,
                idPrestador: data?.idServicio?.prestadores[0]
            });
        }
    }, [data]);

    const handleSubmit = () => {
        const submit = async () => {
            const body = {
                idBuque: data?.idBuque?.id,
                idGiro: data?.idGiro?.id,
                idMovimiento: data?.idMuelle?.idMovimiento,
                idServicio: data?.idServicio?.id,
                idPrestador: data?.idPrestador?.id,
                nota: data?.nota
            };

            const response: any = await addServiceRequest({ body });

            if (!response?.error) {
                dispatch(
                    showAlert({
                        title: 'Solicitud de servicio creada correctamente',
                        keepMounted: true,
                        confirmText: 'Aceptar'
                    })
                );
            } else {
                handleErrors(response?.error);
            }
        };

        dispatch(
            showAlert({
                title: '¿Confirmar solicitud de servicio?',
                confirmText: 'Confirmar',
                confirmAction: submit,
                cancelText: 'Cancelar',
                icon: 'info',
                keepMounted: true
            })
        );
    };

    const resetInputs = () => {
        const doc: HTMLElement = document.getElementsByClassName(
            'MuiAutocomplete-clearIndicator'
        )[0] as HTMLElement;
        if (doc) doc.click()!;
        setData(null);
    };

    return {
        data,
        handleChange,
        handleSubmit,
        resetInputs,
        ...fetchProps
    };
}

export default useServiceRequest;
