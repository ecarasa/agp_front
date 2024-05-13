import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CERTIFICATE_STATES, SHIP_STATES } from '../../commons/States';
import {
    useLazyAnswerParametricsQuery,
    useGetTerminalsQuery,
    useLazyGetGiroByIdQuery,
    usePostAnswerMutation,
    useLazyDownloadFileQuery,
    useGetMovementsHistoryQuery,
    useGetTrafficTypesQuery,
    useGetOperationTypesQuery,
    useUpdateTripDataMutation,
    useUpdateMovementMutation,
    useFinishDockingReviewMutation,
    useRenewalDockingMutation
} from '../../services/girosApi';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { showAlert } from '../../features/slices/applicationSlice';
import { enqueueSnackbar } from 'notistack';
import { downloadBase64File, handleErrors } from '../../utils/common';
import useUserAccess from '../../hooks/useUserAccess';

function useGiroDetail() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userCompany = useAppSelector((state) => state?.auth?.user?.empresa);
    const { id } = useParams();
    const access = useUserAccess();
    const location = useLocation();
    const isNavi = location?.pathname?.includes('navi');
    const isRenewal = location?.pathname?.includes('renovacion');
    const [showNote, setShowNote] = useState<boolean>(false);
    const [note, setNote] = useState<any>(null);
    const [errors, setErrors] = useState<any>(null);
    const [openEditGeneralInfoDrawer, setOpenEditGeneralInfoDrawer] = useState<boolean>(false);
    const [giroData, setGiroData] = useState<any>(null);
    const [responseId, setResponseId] = useState<number | null>(null);
    const [movements, setMovements] = useState<any>(giroData?.movimientos || null);
    const [movementToRenew, setMovementToRenew] = useState<any>(null);
    const [postAnswer, { isLoading: postingAnswer }] = usePostAnswerMutation();
    const [finishDockingReview, { isLoading: updatingDockingReview }] =
        useFinishDockingReviewMutation();
    const [getAnswerParametrics, { isLoading: loadingAnswers }] = useLazyAnswerParametricsQuery();
    const [downloadFile, { isFetching: downloadingFile }] = useLazyDownloadFileQuery();
    const [answerParametrics, setAnswerParametrics] = useState<any>(null);
    const [tripGeneralInfo, setTripGeneralInfo] = useState<any>(null);
    const [sectionData, setSectionData] = useState<{
        [key: string]: { [key: string]: any };
    } | null>(null);
    const [getGiro, { isLoading: loadingGiro, isFetching: fetchingGiro }] =
        useLazyGetGiroByIdQuery();
    const { data: terminals } = useGetTerminalsQuery();
    const { data: movementsHistory } = useGetMovementsHistoryQuery(giroData?.id, {
        skip: !giroData?.id,
        refetchOnMountOrArgChange: true
    });
    const { data: trafficTypes, isFetching: fetchinTrafficTypes } = useGetTrafficTypesQuery({});
    const { data: operationTypes, isFetching: fetchinOperationTypes } = useGetOperationTypesQuery(
        {}
    );
    const [updateTripData, { isLoading: updatingTripData }] = useUpdateTripDataMutation();
    const [updateMovement, { isLoading: updatingMovement }] = useUpdateMovementMutation();
    const [renewalDocking, { isLoading: renewingDocking }] = useRenewalDockingMutation();
    const [isModifying, setIsModifying] = useState<boolean>(false);

    const getAnswers = async () => {
        const response = await getAnswerParametrics(giroData?.id);
        if (!response?.error) setAnswerParametrics(response?.data);
    };

    useEffect(() => {
        if (isRenewal && movements?.length === 1) {
            setMovementToRenew(movements[0]);
        }
    }, [isRenewal, movements]);

    useEffect(() => {
        if (giroData?.id) {
            getAnswers();
            if (giroData?.estado === 'modificando') {
                setIsModifying(true);
            }
        }
        // eslint-disable-next-line
    }, [giroData]);

    useEffect(() => {
        if (giroData && !movements && userCompany) {
            if (!!userCompany?.perfiles?.find((i: any) => i.id === 3) && userCompany?.id !== 1) {
                const filteredItems = giroData.movimientos.filter(
                    (i: any) => i.terminal.sigla === userCompany?.nombre
                );
                setMovements(filteredItems);
            } else {
                setMovements(giroData.movimientos);
            }
        }
        if (giroData && !sectionData) loadSectionData();
        if (giroData) {
            setTripGeneralInfo({
                esEntradaPuerto: true,
                idTipoTrafico: giroData?.tipoTrafico?.id || '',
                idTipoOperacion: giroData?.tipoOperacion?.id || '',
                fechaEntradaVanguardia: giroData?.fechaEntradaVanguardia,
                fechaSalidaVanguardia: giroData?.fechaSalidaVanguardia,
                buqueInactivo: giroData?.buqueInactivoPuerto,
                nota: giroData?.nota || ''
            });
        }
        // eslint-disable-next-line
    }, [giroData, userCompany]);

    useEffect(() => {
        if ((id && !giroData) || id !== giroData?.id) loadData();
        // eslint-disable-next-line
    }, [id]);

    const loadData = async () => {
        try {
            const response = await getGiro(id);
            if (!response?.error) setGiroData(response?.data);
            else handleErrors(response?.error);
        } catch (e) {}
    };

    const getShipCertificates = async () => {
        let certificateData: { [key: string]: any } = {};
        _.orderBy(giroData?.buque?.certificados, ['tipoCertificado.id', 'asc'])?.forEach(
            (i: any) => {
                certificateData[i?.tipoCertificado?.nombre] = CERTIFICATE_STATES[i?.estado];
            }
        );

        return certificateData;
    };

    const loadSectionData = async () => {
        const dimensions = {
            'Teu a desembarcar': Number(giroData?.teuDesembarcar),
            'Carga a desembarcar': giroData?.tipoCargaDesembarcar?.nombre || '-',
            'Teu a embarcar': Number(giroData?.teuEmbarcar),
            'Carga a embarcar': giroData?.tipoCargaEmbarcar?.nombre || '-',
            'Calado de entrada': Number(giroData?.caladoEntrada),
            'Calado de salida': Number(giroData?.caladoSalida)
        };

        const messageData = {
            Emisor: '-',
            Receptor: '-',
            'Fecha y hora Emisión': '-',
            'Tipo de mensaje': '-'
        };

        const certArqueo = giroData?.buque?.certificados?.find(
            (i: any) => i.tipoCertificado?.id === 1
        );

        const certMatricula = giroData?.buque?.certificados?.find(
            (i: any) => i.tipoCertificado?.id === 2
        );

        const shipData = {
            'Nombre del buque': giroData?.buque?.nombre,
            Estado: SHIP_STATES[giroData?.buque?.estado],
            'Tipo de embarcación': giroData?.buque?.tipoBuque?.nombre,
            'N° de IMO': giroData?.buque?.imo || 'N/A',
            'Señal distintiva': giroData?.buque?.senalDistintiva || '-',
            Bandera: giroData?.buque?.pais?.nombre,
            Matrícula: giroData?.buque?.matricula,
            'Calado de construccion': Number(giroData?.buque?.calado),
            TRB: Number(giroData?.buque?.trb),
            TRN: Number(giroData?.buque?.trn),
            'Nombre de capitán': giroData?.capitan,
            'Cantidad de tripulantes': giroData?.tripulacion,
            'Cantidad de pasajeros': giroData?.pasajeros || '-'
            // 'N° LLoyd': certMatricula?.numero || '-',
            // 'Fecha de vencimiento Lloyd': certMatricula?.fechaVencimiento
            //     ? dayjs(certMatricula?.fechaVencimiento).format('DD/MM/YYYY')
            //     : '-',
            // 'N° de certificado': certArqueo?.numero || '-',
            // 'Vencimiento de certificado': certArqueo?.fechaVencimiento
            //     ? dayjs(certArqueo?.fechaVencimiento).format('DD/MM/YYYY')
            //     : '-',
            // 'Sociedad de clasificacion': certArqueo?.idEmisor || '-'
        };

        const certificatesData = await getShipCertificates();

        const conversationHistory = {
            'Conversacion 1': 'Solicitud de atraque creada'
        };

        setSectionData({
            ...sectionData,
            dimensions: dimensions,
            messageData: messageData,
            shipData: shipData,
            certificateData: certificatesData,
            conversationHistory: conversationHistory
        });
    };

    const getOtherAssemblers = () => {
        const data = giroData?.otrosArmadores || [];
        let string = '';
        data?.forEach((i: any, index: number) => {
            string += i.nombre + `${index + 1 === data?.length ? '' : ' / '}`;
        });
        return string;
    };

    const getPorts = (type: string) => {
        let string = '';

        const auxPorts = giroData?.puertos?.filter((i: any) => i.tipo === type);

        if (!!auxPorts?.length) {
            auxPorts?.forEach((i: any, index: number) => {
                string += i.ciudad?.nombre + `${index + 1 === auxPorts?.length ? '' : ' / '}`;
            });
        }

        return string;
    };

    const handleChange = (e: any, item: any) => {
        const { name, value } = e.target;

        let auxItem: any = movements?.find((i: any) => i?.id === item?.id);
        const auxItemFromEp = giroData?.movimientos?.find((i: any) => i.id === item.id);

        const auxItemIndex = movements?.findIndex((i: any) => i.id === item.id);
        const terminal = terminals?.filter((i: any) => i?.id === item?.terminal?.id);
        const muelle = terminal[0]?.muelle?.find((i: any) => i.id === Number(value));

        if (isNavi) {
            auxItem = {
                ...auxItem,
                [name]: value
            };
        } else if (name === 'andana') {
            if (!value) {
                auxItem = {
                    ...auxItem,
                    andana: auxItemFromEp?.andana === null ? null : ''
                };
            } else {
                auxItem = {
                    ...auxItem,
                    andana: Number(value)
                };
            }
        } else {
            auxItem = {
                ...auxItem,
                terminal: {
                    ...auxItem.terminal,
                    muelleMovimiento: {
                        id: muelle?.id,
                        nombre: muelle?.nombre
                    }
                }
            };
        }

        const auxMovements = [...movements];
        auxMovements[auxItemIndex] = auxItem;
        setMovements(auxMovements);
    };

    const validateIsEqual = useCallback(() => {
        return _.isEqual(movements, giroData?.movimientos);
        // eslint-disable-next-line
    }, [movements]);

    const handleSetNote = (e: any) => setNote(e.target.value);

    const handleClose = () => setResponseId(null);

    const canExecute = (id: number) => !!_.find(answerParametrics, ['id', id]);

    const handleSubmit = async () => {
        let modifiedItems: any = [];

        movements.forEach((movItem: any) => {
            let giroItem = giroData?.movimientos?.find(
                (i: any) => Number(i.id) === Number(movItem.id)
            );
            if (!_.isEqual(movItem, giroItem)) {
                modifiedItems.push({
                    id: movItem.id,
                    idMuelle: movItem.terminal.muelleMovimiento.id,
                    ...(movItem?.andana && {
                        andana: movItem.andana
                    })
                });
            }
        });

        const response: any = await postAnswer({
            idGiro: Number(id),
            idRespuesta: responseId,
            data: {
                movimientos: modifiedItems,
                ...(note && { nota: note })
            }
        });

        if (!response.error) {
            const title = _.find(answerParametrics, ['id', responseId])?.mensaje;
            dispatch(
                showAlert({
                    title: title,
                    keepMounted: true,
                    confirmText: 'Cerrar',
                    confirmAction: () => navigate('/agp/giros')
                })
            );
        } else {
            enqueueSnackbar('Ocurrió un error.', { variant: 'error' });
        }
    };

    const handleDownloadFile = async () => {
        try {
            const response: any = await downloadFile(parseInt(giroData.id));

            if (response?.error) {
                enqueueSnackbar(response?.error?.data?.message, { variant: 'error' });
            } else {
                downloadBase64File(response?.data, giroData.id, 'giro');
            }
        } catch (e) {
            enqueueSnackbar('Ocurrió un error.', { variant: 'error' });
        }
    };

    const handleEditGeneralInfo = () => {
        setOpenEditGeneralInfoDrawer(true);
    };

    const handleCloseEditDrawer = () => {
        setOpenEditGeneralInfoDrawer(false);
    };

    const handleChangeTripInfo = (event: any) => {
        const { value, name, checked, type } = event.target;
        setTripGeneralInfo({
            ...tripGeneralInfo,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleUpdateTripData = async () => {
        if (!tripGeneralInfo?.fechaEntradaVanguardia) {
            return setErrors({
                fechaEntradaVanguardia: 'Campo requerido'
            });
        } else if (!tripGeneralInfo?.idTipoTrafico) {
            return setErrors({
                idTipoTrafico: 'Campo requerido'
            });
        } else if (!tripGeneralInfo?.idTipoOperacion) {
            return setErrors({
                idTipoOperacion: 'Campo requerido'
            });
        } else {
            setErrors(null);
        }

        let newTripGeneralInfo = { ...tripGeneralInfo };
        if (newTripGeneralInfo?.fechaSalidaVanguardia) {
            newTripGeneralInfo.esEntradaPuerto = false;
        } else {
            newTripGeneralInfo.esEntradaPuerto = true;
        }

        const response: any = await updateTripData({
            idGiro: giroData?.id,
            data: newTripGeneralInfo
        });
        if (!response?.error) {
            enqueueSnackbar('¡Datos modificados con éxito!.', { variant: 'success' });
            setOpenEditGeneralInfoDrawer(false);
            await loadData();
        } else {
            handleErrors(response?.error);
        }
    };

    const handleUpdateMovement = async (item: any) => {
        const data = {
            esIngresoReal: true,
            ingresoSolicitado: item?.fechaETA,
            egresoSolicitado: item?.fechaETD,
            idMuelle: item?.terminal?.muelleMovimiento?.id,
            andana: item?.andana,
            ingresoReal: item?.fechaIngreso,
            egresoReal: item?.fechaEgreso,
            idMuelleOperacion: item?.muelleOperacion?.id || item?.terminal?.muelleMovimiento?.id,
            andanaOperacion: item?.andanaOperacion || item?.andana
        };

        const response: any = await updateMovement({
            idGiro: giroData.id,
            idMove: item.id,
            data: data
        });
        if (!response.error) {
            enqueueSnackbar('¡Datos de movimiento actualizados!', { variant: 'success' });
            navigate(0);
        } else {
            handleErrors(response?.error);
        }
    };

    const dateValidations = (str: string, date: string, item?: any) => {
        let value: boolean = false;
        const dateObject = new Date(date);

        if (str === 'A') {
            const dateEntradaVanguardia = new Date(giroData?.fechaEntradaVanguardia);

            if (dateObject < dateEntradaVanguardia) {
                value = true;
                setErrors({
                    ...errors,
                    [item?.id]: {
                        ...errors?.[item?.id],
                        fechaIngreso:
                            'Ingreso real no debe ser menor que fecha de ingreso vanguardia'
                    }
                });
            } else {
                let auxObject = { ...errors };
                delete auxObject?.[item.id]?.fechaIngreso;
                setErrors(auxObject);
            }
        }
        if (str === 'B') {
            const dateBase = new Date(item?.fechaIngreso);
            if (dateObject <= dateBase) {
                value = true;
                setErrors({
                    ...errors,
                    [item?.id]: {
                        ...errors?.[item?.id],
                        fechaEgreso: 'Egreso real debe ser mayor a fecha de ingreso real'
                    }
                });
            } else {
                let auxObject = { ...errors };
                delete auxObject[item.id]?.fechaEgreso;
                setErrors(auxObject);
            }
        }
        if (str === 'C') {
            const movementsFiltered = giroData?.movimientos?.filter((i: any) => !!i?.fechaEgreso);
            const movementsSorted = _.orderBy(movementsFiltered, ['fechaEgreso'], ['desc']);
            const dateEntradaVanguardia = new Date(giroData?.fechaEntradaVanguardia);
            const lastMovement = new Date(movementsSorted[0]?.fechaEgreso);

            if (dateObject < dateEntradaVanguardia) {
                value = true;
                setErrors({
                    ...errors,
                    fechaSalidaVanguardia:
                        'Fecha de salida vanguardia debe ser mayor que la fecha de entrada vanguardia'
                });
            } else if (dateObject <= lastMovement) {
                value = true;
                setErrors({
                    ...errors,
                    fechaSalidaVanguardia:
                        'Fecha de salida vanguardia debe ser mayor que el último egreso real'
                });
            } else {
                let auxObject = { ...errors };
                delete auxObject.fechaSalidaVanguardia;
                setErrors(auxObject);
            }
        }

        return value;
    };

    const handleShowNote = () => {
        setShowNote(!showNote);
    };

    const handleFinishReview = async () => {
        const data = {
            finalizarRevision: true
        };
        try {
            const response: any = await finishDockingReview({ idGiro: giroData?.id, data });
            if (!response?.error) {
                enqueueSnackbar('Solicitud actualizada correctamente', { variant: 'success' });
                navigate('/agp/giros/navi');
            } else {
                handleErrors(response?.error);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const calculateValidation = useCallback(
        (type: string, item?: any) => {
            let value = undefined;

            if (type === 'ingresoReal') {
                value =
                    isRenewal ||
                    (!isNavi &&
                        (!!giroData?.fechaSalidaVanguardia || !giroData?.fechaEntradaVanguardia)) ||
                    (isNavi &&
                        giroData?.estado !== 'revision' &&
                        !giroData?.fechaEntradaVanguardia);
            }
            if (type === 'egresoReal') {
                value =
                    isRenewal ||
                    ((!!giroData?.fechaSalidaVanguardia ||
                        !giroData?.fechaEntradaVanguardia ||
                        !item?.fechaIngreso) &&
                        giroData?.estado !== 'revision');
            }
            if (type === 'sitio') {
                value =
                    isRenewal ||
                    !answerParametrics?.length ||
                    (item?.terminal.sigla !== userCompany?.nombre &&
                        !answerParametrics?.find((i: any) => i?.id === 8 || i?.id === 2)) ||
                    (!isNavi &&
                        (giroData?.estado === 'revision' ||
                            !!giroData?.fechaSalidaVanguardia ||
                            !!item?.fechaIngreso)) ||
                    (isNavi &&
                        ((!!giroData?.fechaSalidaVanguardia && giroData?.estado !== 'revision') ||
                            !access?.[2]?.[26]));
            }
            if (type === 'andana') {
                value =
                    isRenewal ||
                    !answerParametrics?.length ||
                    (item?.terminal.sigla !== userCompany?.nombre &&
                        !answerParametrics?.find((i: any) => i.id === 8 || i?.id === 2)) ||
                    (!isNavi &&
                        (giroData?.estado === 'revision' ||
                            !!giroData?.fechaSalidaVanguardia ||
                            !!item?.fechaIngreso)) ||
                    (isNavi &&
                        ((!!giroData?.fechaSalidaVanguardia && giroData?.estado !== 'revision') ||
                            !access?.[2]?.[26]));
            }
            if (type === 'sitioReal') {
                value =
                    isRenewal ||
                    (((!isNavi && item?.terminal?.sigla !== userCompany?.nombre) ||
                        !!giroData?.fechaSalidaVanguardia ||
                        !giroData?.fechaEntradaVanguardia) &&
                        giroData?.estado !== 'revision');
            }
            if (type === 'andanaReal') {
                value =
                    isRenewal ||
                    (((!isNavi && item?.terminal?.sigla !== userCompany?.nombre) ||
                        !!giroData?.fechaSalidaVanguardia ||
                        !giroData?.fechaEntradaVanguardia) &&
                        giroData?.estado !== 'revision');
            }
            return value;
        },
        // eslint-disable-next-line
        [giroData, isNavi, answerParametrics, access, userCompany]
    );

    const handleConfirmEditDocking = () => {
        dispatch(
            showAlert({
                title: 'Modificar giro',
                message: '¿Desea comenzar a modificarlo?',
                confirmAction: setIsModifying,
                itemData: true,
                icon: 'info',
                cancelText: 'Cancelar'
            })
        );
    };

    const showEditButton =
        !_.isEmpty(giroData) &&
        ['operando', 'aprobado', 'modificando'].includes(giroData?.estado) &&
        !!access?.[2]?.[31];

    const canAddRemoveMovements = !isNavi && !!access?.[2]?.[31] && isModifying;

    const handleCheckMovement = (event: any, item: any) => {
        const { checked } = event.target;
        if (checked) {
            setMovementToRenew(item);
        } else {
            setMovementToRenew(null);
        }
    };

    const confirmSubmitRenewal = () => {
        dispatch(
            showAlert({
                title: '¿Confirma que desea renovar la solicitud?',
                keepMounted: true,
                confirmText: 'Confirmar',
                confirmAction: handleSubmitRenewal,
                cancelText: 'Cancelar',
                icon: 'info'
            })
        );
    };

    const handleSubmitRenewal = async () => {
        const response: any = await renewalDocking({
            idGiro: giroData?.id,
            idMovement: movementToRenew?.id
        });
        if (!response.error) {
            dispatch(
                showAlert({
                    title: 'Solicitud de giro renovada correctamente',
                    keepMounted: true,
                    confirmAction: navigate,
                    itemData: -1
                })
            );
        } else {
            handleErrors(response?.error);
        }
    };

    return {
        answerParametrics,
        access,
        canAddRemoveMovements,
        downloadingFile,
        errors,
        fetchingGiro,
        fetchinOperationTypes,
        fetchinTrafficTypes,
        giroData,
        isModifying,
        loadingAnswers,
        loadingGiro,
        movements,
        movementsHistory,
        movementToRenew,
        openEditGeneralInfoDrawer,
        operationTypes,
        postingAnswer,
        renewingDocking,
        responseId,
        sectionData,
        showEditButton,
        showNote,
        terminals,
        trafficTypes,
        tripGeneralInfo,
        updatingDockingReview,
        updatingMovement,
        updatingTripData,
        userCompany,
        calculateValidation,
        canExecute,
        confirmSubmitRenewal,
        dateValidations,
        getOtherAssemblers,
        getPorts,
        handleChange,
        handleChangeTripInfo,
        handleCheckMovement,
        handleClose,
        handleCloseEditDrawer,
        handleConfirmEditDocking,
        handleDownloadFile,
        handleEditGeneralInfo,
        handleFinishReview,
        handleSetNote,
        handleShowNote,
        handleSubmit,
        handleUpdateMovement,
        handleUpdateTripData,
        setResponseId,
        validateIsEqual
    };
}

export default useGiroDetail;
