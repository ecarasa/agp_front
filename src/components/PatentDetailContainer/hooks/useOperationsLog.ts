import { enqueueSnackbar } from 'notistack';
import { handleErrors } from '../../../utils/common';
import { useAddOperationMutation, useGetPatentOperationsQuery } from '../../../services/patentsApi';
import { useGetTerminalsQuery } from '../../../services/girosApi';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

function useOperationsLog() {
    const { id } = useParams();
    const [operationData, setOperationData] = useState<any>(null);
    const [errors, setErrors] = useState<any>(null);
    const [openOperationLogDrawer, setOpenOperationLogDrawer] = useState<boolean>(false);
    const { data: terminals, isLoading: loadingTerminals } = useGetTerminalsQuery(undefined, {
        skip: !operationData?.hasOwnProperty('nuevoRegistro')
    });
    const [addOperation, { isLoading: addingOperation }] = useAddOperationMutation();

    const handleSubmitOperation = async (callback: any) => {
        try {
            const data = {
                idMuelle: operationData?.muelle?.id,
                andana: operationData?.andana,
                fechaEntrada: operationData?.fechaEntrada,
                fechaSalida: operationData?.fechaSalida
            };

            const response: any = await addOperation({ patentId: id, body: data });

            if (!response?.error) {
                enqueueSnackbar('Operación registrada correctamente', { variant: 'success' });
                callback();
            } else {
                handleErrors(response?.error);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleLogMovement = (item?: any) => {
        setOpenOperationLogDrawer(true);
        if (item?.id) {
            setOperationData({
                terminal: item?.muelle?.terminal,
                muelle: { id: item?.muelle?.id, nombre: item?.muelle?.nombre }
            });
        } else {
            setOperationData({
                nuevoRegistro: true
            });
        }
    };

    const handleCloseOperationLogDrawer = () => {
        setOpenOperationLogDrawer(false);
        setOperationData(null);
        setErrors(null);
    };

    const validateDates = (value: any, name: string) => {
        if (name === 'fechaEntrada') {
            const dateBase = new Date(value);
            const currentDate = new Date();

            if (dateBase > currentDate) {
                setErrors({
                    ...errors,
                    fechaEntrada: 'La fecha de entrada no puede ser posterior a la hora actual.'
                });
            } else {
                if (operationData?.fechaSalida) {
                    const outDate = new Date(operationData?.fechaSalida);
                    if (dateBase > outDate) {
                        setErrors({
                            ...errors,
                            fechaSalida:
                                'La fecha de salida no puede ser menor que la fecha de entrada.'
                        });
                    } else {
                        let auxObject = { ...errors };
                        delete auxObject['fechaSalida'];
                        setErrors(auxObject);
                    }
                }
                if (errors?.fechaEntrada) {
                    let auxObject = { ...errors };
                    delete auxObject['fechaEntrada'];
                    setErrors(auxObject);
                }
            }
        }
        if (name === 'fechaSalida' && value) {
            const dateBase = new Date(operationData.fechaEntrada);
            const dateToCompare = new Date(value);
            if (dateBase > dateToCompare) {
                setErrors({
                    ...errors,
                    fechaSalida: 'La fecha de salida no puede ser menor que la fecha de entrada.'
                });
            } else {
                let auxObject = { ...errors };
                delete auxObject['fechaSalida'];
                setErrors(auxObject);
            }
        }
    };

    const handleChangeOperationData = (e: any) => {
        const { name, value } = e?.target;

        if (!value) {
            let auxObject = { ...operationData };
            delete auxObject[name];
            setOperationData(auxObject);
        } else {
            setOperationData({
                ...operationData,
                [name]: value
            });
        }
    };

    return {
        addingOperation,
        errors,
        loadingTerminals,
        openOperationLogDrawer,
        operationData,
        terminals,
        handleChangeOperationData,
        handleCloseOperationLogDrawer,
        handleLogMovement,
        handleSubmitOperation,
        setErrors,
        validateDates
    };
}

export default useOperationsLog;
