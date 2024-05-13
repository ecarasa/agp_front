import { downloadFile, handleErrors } from '../../../../utils/common';
import { enqueueSnackbar } from 'notistack';
import { FILE_EXTENSION } from '../../../../constants/regex';
import { showAlert } from '../../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    useAddCertificateMutation,
    useDeleteCertificateMutation,
    useLazyGetBuqueByIdQuery,
    useGetParametricDataQuery,
    useLazyGetCertificatesByIdBuqueQuery,
    useAssignCertificatesMutation,
    useLazyDownloadCertificateQuery
} from '../../../../services/shipsApi';

const useCertificates = () => {
    const { id } = useParams();
    const { t } = useTranslation('userForm');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [data, setData] = useState<any>({
        ddjj: false,
        fechaEmision: '',
        fechaVencimiento: ''
    });
    const [shipData, setShipData] = useState<any>();
    const [error, setError] = useState<any>('');
    const [dateErrors, setDateErrors] = useState<any>(null);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [loadedFiles, setLoadedFiles] = useState<any>([]);
    const [downloadCertificate] = useLazyDownloadCertificateQuery();
    const [getBuqueById, { isFetching: loadingShipData }] = useLazyGetBuqueByIdQuery();
    const [assignCertificates, { isLoading: assigningCertificates }] =
        useAssignCertificatesMutation();
    const [deleteCertificateByUuid, { isLoading: deletingCertificate }] =
        useDeleteCertificateMutation();
    const [getCertificatesByIdBuque, { isLoading: gettingCertificates, error: certificatesError }] =
        useLazyGetCertificatesByIdBuqueQuery({ refetchOnFocus: true });
    const [uploadFile, { isLoading: uploadingFile }] = useAddCertificateMutation();
    let isLoading: boolean = false;
    const { data: parametrics, isLoading: loadingParametricsData } = useGetParametricDataQuery({});

    const handleCloseDrawer = () => {
        setData({
            ddjj: false,
            fechaEmision: '',
            fechaVencimiento: ''
        });
        setOpenDrawer(false);
    };

    const certificateTypesCombo = useCallback(() => {
        if (shipData?.estado === 'BO') {
            return parametrics?.tiposCertificado?.filter(
                (i: any) => !loadedFiles.find((file: any) => file?.tipoCertificado?.id === i?.id)
            );
        } else {
            return parametrics?.tiposCertificado;
        }
        // eslint-disable-next-line
    }, [shipData, parametrics, loadedFiles]);

    const handleChange = (e: any) => {
        setData({
            ...data,
            [e.target.name]: e?.target?.type === 'checkbox' ? e.target.checked : e.target.value
        });
    };

    const handleViewDoc = async (item: any) => {
        try {
            isLoading = true;
            const response: any = await downloadCertificate({
                idBuque: id,
                idCertificate: item?.id
            });

            await fetch(response?.data?.presignedUrl)
                .then((response) => response.blob())
                .then((blob) => {
                    const name = `${shipData?.nombre}-${item?.tipoCertificado?.nombre
                        .replace(/ /g, '-')
                        .toLowerCase()}${item?.rutaAdjunto.match(FILE_EXTENSION)[0]}`;
                    downloadFile({ blob, name });
                })
                .catch((error) => {
                    enqueueSnackbar('Ocurrió un problema', {
                        variant: 'error'
                    });
                });
        } catch (e: any) {
            enqueueSnackbar(e?.error?.data?.message || 'Ocurrió un problema', { variant: 'error' });
        } finally {
            isLoading = false;
        }
    };

    const getCertificates = async () => {
        try {
            const response: any = await getCertificatesByIdBuque(id);
            if (response?.error)
                enqueueSnackbar(response?.error?.data?.message, { variant: 'error' });
            else setLoadedFiles(response?.data);
        } catch (e) {
            console.error(e);
        }
    };

    const getShipById = async () => {
        const response = await getBuqueById(id);
        if (response) {
            setShipData(response?.data?.data);
        }
    };

    useEffect(() => {
        if (id && !loadedFiles?.length && id) getCertificates();
        if (id && !shipData) getShipById();
        // eslint-disable-next-line
    }, [id]);

    const handleDeleteCertificate = (item: any) => {
        const deleteCertificate = async () => {
            try {
                const response: any = await deleteCertificateByUuid({
                    idBuque: id,
                    uuid: item?.id
                });
                if (response?.error) {
                    enqueueSnackbar(response?.error?.data?.message, { variant: 'error' });
                } else {
                    let arrayAux = [...loadedFiles];
                    const index = loadedFiles?.findIndex((i: any) => i?.id === item?.id);
                    arrayAux.splice(index, 1);
                    setLoadedFiles(arrayAux);
                    enqueueSnackbar('Certificado eliminado exitosamente.', { variant: 'success' });
                }
            } catch (e) {
                console.log(e);
            }
        };
        dispatch(
            showAlert({
                title: `${t('buquesCertificates.deleteCertificateTitle')}`,
                message: `${t('buquesCertificates.confirmDeleteCertificate')}`,
                confirmAction: deleteCertificate,
                confirmText: `${t('delete')}`,
                cancelText: `${t('cancel')}`,
                icon: 'info'
            })
        );
    };

    const handleUploadFile = async () => {
        if (data?.fechaEmision && data?.fechaVencimiento) {
            const fechaEmision = new Date(data?.fechaEmision);
            const fechaVto = new Date(data?.fechaVencimiento);
            if (fechaEmision > fechaVto) {
                setDateErrors({
                    fechaVencimiento: 'Fecha de vencimiento incorrecta'
                });
                return enqueueSnackbar(
                    'Fecha de vencimiento debe ser mayor que la fecha de emisión',
                    { variant: 'error' }
                );
            } else {
                let auxDateErrors = { ...dateErrors };
                delete auxDateErrors?.fechaVencimiento;
                setDateErrors(auxDateErrors);
            }
        }

        if (!data?.certificateType?.id)
            return enqueueSnackbar('Seleccione tipo de certificado', { variant: 'error' });
        if (!data?.ddjj && !data?.selectedFile) {
            return enqueueSnackbar('Falta seleccionar el archivo', { variant: 'error' });
        }

        const body: any = {
            ddjj: data?.ddjj,
            file: data?.selectedFile,
            ...(data?.numero && { numero: data?.numero }),
            ...(data?.puntaje && { puntaje: data?.puntaje }),
            ...(data?.idEmisor && { idEmisor: Number(data?.idEmisor) }),
            ...(data?.fechaEmision && { fechaEmision: data?.fechaEmision }),
            ...(data?.fechaVencimiento && { fechaVencimiento: data?.fechaVencimiento })
        };

        const bodyFormData = new FormData();
        Object.keys(body).forEach((key: any) => bodyFormData.append(key, body[key]));

        try {
            const response: any = await uploadFile({
                bodyFormData,
                idBuque: id,
                idCertificate: data?.certificateType?.id
            });
            if (!response?.error) {
                await getCertificates();
                getShipById();
                setData({ ddjj: false });
                setOpenDrawer(false);
                enqueueSnackbar('Certificado cargado con éxito', {
                    variant: 'success'
                });
            } else {
                handleErrors(response?.error);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleChangeFile = (e: any) => {
        const file = e?.target?.files[0];

        if (file?.size > 30000000) return setError('El archivo no debe ser mayor a 30MB');
        if (!['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'].includes(file?.type)) {
            return setError('Extensión de archivo no admitido');
        }

        setError('');
        setData({
            ...data,
            selectedFile: file,
            ddjj: data?.ddjj && file ? false : data?.ddjj
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const submitAction = async () => {
            try {
                const response: any = await assignCertificates(id);
                if (!response?.error) {
                    const handleGoBack = () => navigate(-1);
                    dispatch(
                        showAlert({
                            title: 'Certificados asignados exitosamente',
                            message:
                                'Los certificados ya se encuentran asignados y en instancia de aprobación',
                            confirmText: 'Cerrar',
                            confirmAction: handleGoBack
                        })
                    );
                } else {
                    enqueueSnackbar('Ocurrio un problema', { variant: 'error' });
                }
            } catch (e) {
                enqueueSnackbar('Ocurrio un problema', { variant: 'error' });
            }
        };
        const data = {
            title:
                shipData?.estado === 'BO' ? 'Asignación de Certificados' : 'Guardar Certificados',
            message:
                shipData?.estado === 'BO'
                    ? `¿Desea asignar los certificados a ${shipData?.nombre}?`
                    : '¿Desea guardar los nuevos certificados?'
        };
        dispatch(
            showAlert({
                title: data.title,
                message: data.message,
                cancelText: 'Cerrar',
                icon: 'info',
                confirmAction: submitAction
            })
        );
    };

    const assignButtonState = useCallback(() => {
        const bindingCertificates = parametrics?.tiposCertificado?.filter(
            (i: any) => i.obligatorio
        );
        const value = !!bindingCertificates?.find((bc: any) => {
            return !loadedFiles?.map((i: any) => i?.tipoCertificado?.id).includes(bc?.id);
        });
        return value;
        // eslint-disable-next-line
    }, [parametrics, loadedFiles]);

    isLoading = gettingCertificates || loadingParametricsData;

    let loadDataError = certificatesError;

    return {
        data,
        error,
        shipData,
        dateErrors,
        isLoading,
        openDrawer,
        loadedFiles,
        parametrics,
        loadDataError,
        uploadingFile,
        loadingShipData,
        gettingCertificates,
        deletingCertificate,
        assigningCertificates,
        setData,
        setError,
        handleSubmit,
        handleChange,
        setOpenDrawer,
        handleViewDoc,
        getCertificates,
        handleUploadFile,
        handleChangeFile,
        assignButtonState,
        handleCloseDrawer,
        certificateTypesCombo,
        handleDeleteCertificate
    };
};

export default useCertificates;
