import _ from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { handleErrors } from '../../../../../utils/common';
import { showAlert } from '../../../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../../../hooks/reduxHooks';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    useDeletePatentMovementMutation,
    useEditPatentMovementMutation,
    useGetDockingByPatentIdQuery,
    useGetPatentOperationsQuery,
    useGetPatentQuery
} from '../../../../../services/patentsApi';

function usePatentMovements({ filters }: any) {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const [initialData, setInitialData] = useState<any>(null);
    const [errors, setErrors] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const { data: patentData } = useGetPatentQuery(id);
    const {
        data: patentMovements,
        isLoading: loadingPatentMovements,
        isFetching: fetchingPatentMovements,
        refetch
    } = useGetPatentOperationsQuery(
        { patentId: id, filters: filters },
        {
            refetchOnMountOrArgChange: true
        }
    );
    const { data: filterOptions, isLoading: loadingFilterOptions } = useGetDockingByPatentIdQuery(
        id,
        {
            refetchOnMountOrArgChange: true
        }
    );
    const [deletePatentMove, { isLoading: deletingMovement }] = useDeletePatentMovementMutation();
    const [editPatentMove, { isLoading: edittingMovement }] = useEditPatentMovementMutation();

    const handleCloseDrawer = () => {
        setOpenDrawer(false);
        setData(null);
        setInitialData(null);
        setErrors(null);
    };

    const handleDelete = async (item: any) => {
        try {
            const response: any = await deletePatentMove({ patentId: id, stayId: item?.id });
            if (!response?.error) {
                enqueueSnackbar('Movimiento eliminado correctamente', { variant: 'success' });
                refetch();
            } else {
                handleErrors(response?.error);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async () => {
        const stayId = data?.id;
        delete data.id;
        const response: any = await editPatentMove({ patentId: id, stayId: stayId, body: data });
        if (!response?.error) {
            enqueueSnackbar('Datos editados correctamente', { variant: 'success' });
            handleCloseDrawer();
            refetch();
        } else {
            handleErrors(response?.error);
        }
    };

    const confirmDeleteMovement = (item: any) => {
        dispatch(
            showAlert({
                title: '¿Desea eliminar este movimiento?',
                confirmText: 'Eliminar',
                confirmAction: handleDelete,
                itemData: item,
                icon: 'info',
                cancelText: 'Cancelar'
            })
        );
    };

    const handleEdit = (item: any) => {
        setInitialData({
            andana: item?.andana,
            fechaEntrada: item?.fechaEntrada,
            fechaSalida: item?.fechaSalida,
            id: item?.id
        });
        setData({
            andana: item?.andana,
            fechaEntrada: item?.fechaEntrada,
            fechaSalida: item?.fechaSalida,
            id: item?.id
        });
        setOpenDrawer(true);
    };

    const handleChangeData = (e: any) => {
        const { name, value } = e?.target;
        if (value) {
            setData({
                ...data,
                [name]: value
            });
        } else {
            let auxObject = { ...data };
            delete auxObject[name];
            setData(auxObject);
        }
    };

    const checkIsEqual = useCallback(() => {
        const dataFormatted = {
            ...data,
            fechaEntrada: data?.fechaEntrada && new Date(data?.fechaEntrada)?.toISOString(),
            fechaSalida: data?.fechaSalida && new Date(data?.fechaSalida)?.toISOString()
        };
        return _.isEqual(dataFormatted, initialData);
        // eslint-disable-next-line
    }, [data]);

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
                if (data?.fechaSalida) {
                    const outDate = new Date(data?.fechaSalida);
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
            const dateBase = new Date(data?.fechaEntrada);
            const dateToCompare = new Date(value);
            const currentDate = new Date();
            if (dateBase > dateToCompare) {
                setErrors({
                    ...errors,
                    fechaSalida: 'La fecha de salida no puede ser menor que la fecha de entrada.'
                });
            } else if (dateToCompare > currentDate) {
                setErrors({
                    ...errors,
                    fechaSalida: 'La fecha de salida no puede ser posterior a la hora actual.'
                });
            } else {
                let auxObject = { ...errors };
                delete auxObject['fechaSalida'];
                setErrors(auxObject);
            }
        }
    };

    return {
        data,
        deletingMovement,
        edittingMovement,
        errors,
        fetchingPatentMovements,
        filterOptions,
        loadingFilterOptions,
        loadingPatentMovements,
        openDrawer,
        patentData,
        patentMovements,
        checkIsEqual,
        confirmDeleteMovement,
        handleChangeData,
        handleCloseDrawer,
        handleDelete,
        handleEdit,
        handleSubmit,
        validateDates
    };
}

export default usePatentMovements;
