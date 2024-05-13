import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { STEPS_VALIDATIONS } from '../../../../commons/States';
import {
    useLazyGetBuqueByIdQuery,
    useLazyGetBuquesFromGirosQuery
} from '../../../../services/shipsApi';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { enqueueSnackbar } from 'notistack';
import {
    hideAlert,
    setStorageLoading,
    showAlert
} from '../../../../features/slices/applicationSlice';
import {
    useAddNewdockingMutation,
    useDockingUploadFilesMutation,
    useGetPortsQuery,
    useLazyDownloadFileQuery,
    useValidateMovsMutation
} from '../../../../services/girosApi';
import { downloadBase64File, handleErrors } from '../../../../utils/common';

function useGirosSave({ filters }: any) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isPatents = location?.pathname?.includes('patentes');
    const [alerts, setAlerts] = useState<any>(null);
    const [stepValidation, setStepValidation] = useState<any>();
    const [step, setStep] = useState<number>(1);
    const [errors, setErrors] = useState<any>(null);
    const [data, setData] = useState<any>({});
    const [getBuques, { isFetching: fetchingShips }] = useLazyGetBuquesFromGirosQuery();
    const [getBuqueById, { isFetching: fetchingShipByid }] = useLazyGetBuqueByIdQuery();
    const [validateMovs, { isLoading: validatingData }] = useValidateMovsMutation();
    const [downloadFile, { isLoading: downloadingFile }] = useLazyDownloadFileQuery();
    const { data: ports, isLoading: loadingPorts } = useGetPortsQuery(undefined, {
        skip: isPatents
    });
    const [addNewdocking, { isLoading: addingShipDocking }] = useAddNewdockingMutation();
    const [uploadDockingRequestFiles, { isLoading: uploadingFiles }] =
        useDockingUploadFilesMutation();
    const [ships, setShips] = useState<any>();
    const [shipInfoDialog, setShipInfoDialog] = useState<{} | null>(null);

    const getShips = async () => {
        const response: any = await getBuques({ ...filters, estado: ['AP', 'SB'], activo: true });
        if (response) setShips(response?.data?.data?.data);
    };

    const showShipFullData = async () => {
        const response = await getBuqueById(data?.buque?.id);
        if (response)
            setShipInfoDialog({ ...response?.data?.data, bandera: data?.buque?.pais?.nombre });
    };

    useEffect(() => {
        if (_.keys(filters)?.length > 2) getShips();
        // eslint-disable-next-line
    }, [filters]);

    const handleChange = (e: any, type?: string) => {
        const { value, name }: any = e.target;

        if (type === 'checkbox') {
            const { checked, name } = e.target;
            setData({
                ...data,
                [name]: checked
            });
        } else {
            if (!value) {
                let newData = { ...data };
                delete newData[name];
                setData(newData);
            } else {
                setData({
                    ...data,
                    [name]: value
                });
            }
        }
    };

    const handleChangeFile = (e: any) => {
        const file = e?.target?.files[0];

        if (file?.size > 30000000)
            return setErrors({ selectedFiles: 'El archivo no debe ser mayor a 30MB' });
        if (!['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'].includes(file?.type)) {
            return setErrors({ selectedFiles: 'Extensión de archivo no admitido' });
        }
        let array = [...(data?.selectedFiles || [])];
        array.push(e?.target?.files[0]);
        setErrors(null);
        setData({ ...data, selectedFiles: array });
    };

    const getRadaDate = () => {
        const initialDatesArray = data?.movimientos?.map(
            (item: any) => new Date(item?.fechaInicio)
        );
        const value = new Date(Math.min.apply(null, initialDatesArray));
        return value;
    };

    const handleSubmit = async () => {
        if (data?.contieneMmpp && !data?.selectedFiles?.length) {
            return setErrors({
                selectedFiles: 'Campo requerido.'
            });
        } else setErrors(null);

        let body: any = {
            ...data,
            idBuque: data?.buque?.id,
            caladoEntrada: Number(data?.caladoEntrada),
            caladoSalida: Number(data?.caladoSalida),
            giroPuertos:
                data?.giroPuertos?.map((i: any) => ({
                    idCiudad: i.idCiudad,
                    tipo: i.tipo
                })) || [],
            ...(data?.teuEmbarcar && {
                teuEmbarcar: Number(data?.teuEmbarcar),
                idTipoCargaEmbarcar: data?.idTipoCargaEmbarcar?.id
            }),
            ...(data?.teuDesembarcar && {
                teuDesembarcar: Number(data?.teuDesembarcar),
                idTipoCargaDesembarcar: data?.idTipoCargaDesembarcar?.id
            }),
            contieneMmpp: !!data?.contieneMmpp,
            requiereServicios: !!data?.requiereServicios,
            movimientos: data?.movimientos?.map((i: any) => ({
                idTerminal: i.terminal.idTerminal,
                idMuelle: i.muelle.idMuelle,
                fechaInicio: i.fechaInicio,
                fechaFin: i.fechaFin
            })),
            idArmadorPrincipal: data?.buque?.armador?.id || null,
            idArmadores: data?.idArmadores?.map((i: any) => i.id),
            ...(data?.hasOwnProperty('fechaIngresoRada')
                ? { fechaIngresoRada: data?.fechaIngresoRada }
                : { fechaIngresoRada: getRadaDate() })
        };
        delete body.buque;
        delete body.selectedFiles;

        const response: any = await addNewdocking(body);
        //If there are errors while creating request
        if (response?.error) {
            if (Array.isArray(response?.error?.data?.message)) {
                response?.error.data.message.forEach((msg: any) => {
                    enqueueSnackbar(msg, {
                        variant: 'error'
                    });
                });
            } else {
                enqueueSnackbar(response?.error?.data?.message || 'Ocurrió un error', {
                    variant: 'error'
                });
            }
            return null;
        }
        //If there isn't errors and exist files to upload
        if (response && !!data?.selectedFiles?.length) {
            try {
                dispatch(setStorageLoading(true));
                const fetchs: any = [];
                data?.selectedFiles?.forEach((file: any) => {
                    const formData = new FormData();
                    formData.append('file', file, file.name);
                    fetchs.push(
                        uploadDockingRequestFiles({
                            idGiro: Number(response?.data?.data?.idGiro),
                            file: formData
                        })
                    );
                });
                await Promise.all(fetchs);
            } catch (e) {
                console.error(e);
                return null;
            } finally {
                dispatch(setStorageLoading(false));
            }
        }

        const responseData = {
            ...response?.data?.data,
            emisor: data?.buque?.agenciaMaritima?.nombre,
            buque: data?.buque?.nombre,
            fechaArribo: data?.fechaIngresoRada
        };

        return responseData;
    };

    const validateData = () => {
        let body: any = null;

        const doFetch = async (body: any) => {
            const response: any = await validateMovs({ idBuque: data?.buque?.id, ...body });
            if (_.keys(response?.data?.data)?.length) {
                const { caladoEntrada, caladoSalida, movimientos, pasajeros } =
                    response?.data?.data;
                if (!!caladoEntrada || !!caladoSalida) {
                    return setErrors({
                        ...(caladoEntrada && { caladoEntrada: caladoEntrada }),
                        ...(caladoSalida && { caladoSalida: caladoSalida })
                    });
                } else {
                    let newErrors = { ...errors };
                    delete newErrors.caladoEntrada;
                    delete newErrors.caladoSalida;
                    setErrors(newErrors);
                }
                if (pasajeros) {
                    return setErrors({
                        pasajeros: pasajeros
                    });
                } else {
                    let newErrors = { ...errors };
                    delete newErrors.pasajeros;
                    setErrors(newErrors);
                }
                if (movimientos) {
                    setAlerts({
                        ...alerts,
                        movimientos: movimientos
                    });
                    setStepValidation({
                        ...stepValidation,
                        [STEPS_VALIDATIONS[step]]: true
                    });
                }
            } else if (response?.error) {
                handleErrors(response?.error);
            } else {
                setStepValidation({
                    ...stepValidation,
                    [STEPS_VALIDATIONS[step]]: true
                });
                setAlerts(null);
                setErrors(null);
                if (step !== 3) setStep(step + 1);
            }
        };

        if (step === 1) {
            body = {
                ...data,
                caladoEntrada: Number(data?.caladoEntrada),
                caladoSalida: Number(data?.caladoSalida)
            };
            if (body?.hasOwnProperty('movimientos')) delete body?.movimientos;
            if (body?.hasOwnProperty('giroPuertos')) delete body?.giroPuertos;
            delete body.buque;
        }
        if (step === 2) {
            const origins = data?.giroPuertos?.filter((i: any) => i.tipo === 'O');
            const destinations = data?.giroPuertos?.filter((i: any) => i.tipo === 'D');

            if (!data?.giroPuertos || origins?.length < 1 || destinations?.length < 1) {
                return enqueueSnackbar('Debe asignar por lo menos una procedencia y un destino.', {
                    variant: 'error'
                });
            }

            body = {
                ...(data?.giroPuertos && {
                    giroPuertos: data?.giroPuertos?.map((i: any) => ({
                        idCiudad: i.idCiudad,
                        tipo: i.tipo
                    }))
                })
            };
        }
        if (step === 3) {
            if (!data?.movimientos?.length) {
                return enqueueSnackbar('Debe registar por lo menos un movimiento.', {
                    variant: 'error'
                });
            }
            const movs = data?.movimientos.map((item: any) => ({
                fechaInicio: item.fechaInicio,
                fechaFin: item.fechaFin,
                idTerminal: item?.terminal?.idTerminal,
                idMuelle: item?.muelle?.idMuelle
            }));
            body = {
                ...(data?.nroEntrada && { nroEntrada: data?.nroEntrada }),
                ...(data?.nroSalida && { nroSalida: data?.nroSalida }),
                ...(data?.movimientos && { movimientos: movs }),
                fechaIngresoRada: data?.fechaIngresoRada
            };
        }
        if (stepValidation?.[STEPS_VALIDATIONS[step]]) {
            setStep(step + 1);
        } else {
            doFetch(body);
        }
    };

    const handleValidationSteps = () => {
        setStepValidation({
            ...stepValidation,
            [STEPS_VALIDATIONS[step]]: false
        });
    };

    const teuValidation = useCallback(
        () =>
            Number(data?.teuDesembarcar) > data?.buque?.maximoTeus ||
            Number(data?.teuEmbarcar) > data?.buque?.maximoTeus,
        // eslint-disable-next-line
        [data]
    );

    const handleDownloadFile = async (idGiro: any) => {
        try {
            const response: any = await downloadFile(Number(idGiro));

            if (response?.error) {
                enqueueSnackbar(response?.error?.data?.message, { variant: 'error' });
            } else {
                downloadBase64File(response?.data, idGiro, 'giro');
            }
        } catch (e) {
            enqueueSnackbar('Ocurrió un error.', { variant: 'error' });
        }
    };

    const descargarPDF = async (idGiro: any) => {
        try {
            await handleDownloadFile(idGiro);
        } catch (error) {
            console.error(error);
        } finally {
            navigate('/agp/giros');
        }
    };

    const abrirModalPDF = (idGiro: number) => {
        dispatch(
            showAlert({
                title: '¿Deseas ver el PDF?',
                confirmAction: descargarPDF,
                itemData: idGiro,
                confirmText: 'Confirmar',
                cancelText: 'Cerrar',
                cancelAction: () => {
                    dispatch(hideAlert());
                    navigate('/agp/giros');
                },
                icon: 'info',
                keepMounted: true
            })
        );
    };

    return {
        step,
        data,
        ships,
        ports,
        errors,
        alerts,
        loadingPorts,
        downloadingFile,
        fetchingShips,
        validatingData,
        stepValidation,
        shipInfoDialog,
        uploadingFiles,
        fetchingShipByid,
        addingShipDocking,
        setData,
        setStep,
        setErrors,
        handleSubmit,
        abrirModalPDF,
        handleChange,
        downloadFile,
        validateData,
        teuValidation,
        handleChangeFile,
        showShipFullData,
        handleDownloadFile,
        setShipInfoDialog,
        handleValidationSteps
    };
}

export default useGirosSave;
