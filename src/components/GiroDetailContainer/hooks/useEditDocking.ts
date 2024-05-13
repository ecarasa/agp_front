import _ from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { handleErrors } from '../../../utils/common';
import { showAlert } from '../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import useUserAccess from '../../../hooks/useUserAccess';
import {
    useAddNewMovMutation,
    useDeleteMoveMutation,
    useGetTerminalsQuery
} from '../../../services/girosApi';

function useEditDocking({ data }: any) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const access = useUserAccess();
    const [form, setForm] = useState<any>(null);

    const { data: terminals, isLoading: loadingTerminals } = useGetTerminalsQuery();
    const [addNewMov, { isLoading: addingNewMov }] = useAddNewMovMutation();
    const [deleteMove, { isLoading: removingMov }] = useDeleteMoveMutation();

    const confirmAction = (action: string, index?: number, item?: number) => {
        if (action === 'add') {
            dispatch(
                showAlert({
                    title: '¿Desea agregar un nuevo movimiento?',
                    confirmText: 'Confirmar',
                    cancelText: 'Cerrar',
                    keepMounted: true,
                    confirmAction: handleAddMov,
                    icon: 'info'
                })
            );
        }
        if (action === 'remove') {
            dispatch(
                showAlert({
                    title: `¿Desea eliminar el movimiento ${index}?`,
                    confirmText: 'Confirmar',
                    cancelText: 'Cerrar',
                    keepMounted: true,
                    confirmAction: handleDeleteMov,
                    itemData: item,
                    icon: 'info'
                })
            );
        }
    };

    const handleDeleteMov = async (item: any) => {
        if (['operando', 'modificando'].includes(data?.estado) && item?.fechaIngreso) {
            return enqueueSnackbar('No se puede eliminar el movimiento.', {
                variant: 'error'
            });
        }
        try {
            const response: any = await deleteMove({ idGiro: id, idMovement: item?.id });
            if (!response?.error) {
                dispatch(
                    showAlert({
                        title: 'Movimiento eliminado correctamente',
                        confirmText: 'Cerrar',
                        keepMounted: true,
                        confirmAction: () => navigate(0)
                    })
                );
            } else {
                handleErrors(response?.error);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddMov = async () => {
        const data = {
            idMuelle: form?.muelle?.id,
            andana: Number(form?.andana),
            fechaInicio: form?.fechaIngreso,
            fechaFin: form?.fechaEgreso
        };

        try {
            const response: any = await addNewMov({ idGiro: id, data });
            if (!response?.error) {
                dispatch(
                    showAlert({
                        title: 'Movimiento agregado correctamente',
                        confirmText: 'Cerrar',
                        keepMounted: true,
                        confirmAction: () => navigate(-1)
                    })
                );
            } else {
                handleErrors(response?.error);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmitChanges = () => {
        const redirect = () => navigate('/agp/giros');
        try {
            dispatch(
                showAlert({
                    title: 'Modificación finalizada',
                    confirmAction: redirect,
                    keepMounted: true
                })
            );
        } catch (e) {
            console.error(e);
        }
    };

    const handleFinishEdition = () => {
        dispatch(
            showAlert({
                title: '¿Desea finalizar solicitud de modificación?',
                icon: 'info',
                cancelText: 'Cancelar',
                confirmAction: handleSubmitChanges
            })
        );
    };

    const handleChangeForm = (e: any) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    };

    return {
        form,
        terminals,
        addingNewMov,
        access,
        loadingTerminals,
        removingMov,
        setForm,
        handleAddMov,
        confirmAction,
        handleChangeForm,
        handleDeleteMov,
        handleFinishEdition
    };
}

export default useEditDocking;
