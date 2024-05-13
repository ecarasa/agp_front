import _ from 'lodash';
import { downloadFile } from '../../../utils/common';
import { enqueueSnackbar } from 'notistack';
import { FILE_EXTENSION } from '../../../constants/regex';
import { showAlert } from '../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useFetchs from './useFetchs';

function useBuques({ filters }: any) {
    const dispatch = useAppDispatch();
    const { t } = useTranslation('userForm');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [openCard, setOpenCard] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [data, setData] = useState<any>();
    const [filteredItems, setFilteredItems] = useState<any>([]);
    const [shipFullData, setShipFullData] = useState<any>(null);
    const [openCertificatesCard, setOpenCertificatesCard] = useState(false);
    const [openRejectModal, setOpenRejectModal] = useState<any>(null);
    const [shipCertificates, setShipCertificates] = useState<any>([]);
    const [downloadingFile, setDownloadingFile] = useState<any>(null);
    const [openEditCertificateDrawer, setOpenEditCertificateDrawer] = useState<any>(null);
    const [itemSelected, setItemSelected] = useState<any>();
    const [openCertificateNoteDrawer, setOpenCertificateNoteDrawer] = useState<any>(null);

    const {
        agencies,
        countries,
        shipById,
        loadingShipFullData,
        fetchingShipData,
        refetchShipsData,
        editShip,
        editCertificate,
        getCertificatesByIdBuque,
        downloadCertificate,
        parametricData,
        ...fetchProps
    } = useFetchs({ selected, filters });

    useEffect(() => {
        if (shipById)
            setShipFullData({
                ...shipById?.data,
                locatario: !_.isEmpty(shipById?.data?.locatario)
                    ? shipById?.data?.locatario
                    : undefined
            });
    }, [shipById]);

    useEffect(() => {
        if (openCard) setOpenCard(false);
        if (openCertificatesCard) setOpenCertificatesCard(false);
        setSelected(null);
        if (itemSelected) setItemSelected(null);
        // eslint-disable-next-line
    }, [filters]);

    const handleOpenCard = () => {
        if (openCertificatesCard) setOpenCertificatesCard(false);
        setOpenCard(true);
    };

    const handleCloseShipInfo = () => {
        setSelected(null);
        setShipFullData(null);
        setOpenCard(false);
    };

    const handleSelectRow = (item: any) => {
        setSelected(item);
        if (itemSelected) setItemSelected(null);
        handleOpenCard();
    };

    const handleChange = (e?: any, type?: any) => {
        const { name, value } = e?.target;
        setData({
            ...data,
            [name]: value
        });
    };

    const getCertificatesByShipId = async (item?: any) => {
        try {
            setIsLoading(true);
            const response: any = await getCertificatesByIdBuque(item?.id || selected?.id);
            if (!response?.error) setShipCertificates(response?.data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleManageMenu = (action: string, item: any) => {
        if (action === 'approve') handleApproveShip(item);
        if (action === 'reject') {
            setMenuOpen(false);
            setOpenRejectModal({ value: true, item: item });
        }
        if (action === 'view-certificates') {
            setOpenCertificatesCard(true);
            if (openCard) setOpenCard(false);
            setSelected(item);
            getCertificatesByShipId(item);
        }
        if (action === 'show-reject-message') {
            setMenuOpen(false);
            setOpenRejectModal({ value: true });
        }

        setAnchorEl(null);
        setMenuOpen(false);
    };

    const handleApproveShip = (item: any) => {
        const approveShip = async () => {
            const mandatoryCertificates = parametricData?.tiposCertificado?.filter(
                (i: any) => i.obligatorio
            );
            const loadedMandatoryCertificates = mandatoryCertificates.filter((mi: any) =>
                item?.certificados.find(
                    (li: any) => li?.tipoCertificado?.id === mi.id && li?.estado === 'AP'
                )
            );
            if (loadedMandatoryCertificates.length === 5) {
                const response: any = await editShip({
                    idBuque: item.id,
                    data: {
                        aprobar: true
                    }
                });
                dispatch(
                    showAlert({
                        title: response?.error
                            ? '¡Algo salió mal!'
                            : '¡Buque aprobado exitosamente!',
                        ...(response?.error && { message: response?.error?.data?.message || '' }),
                        confirmText: 'Cerrar',
                        ...(response?.error && { icon: 'cancel' })
                    })
                );
                if (!response?.error) refetchShipsData();
            } else {
                dispatch(
                    showAlert({
                        title: '¡Algo salió mal!',
                        message: 'Faltan certificados obligatorios por cargar o aprobar.',
                        confirmText: 'Cerrar',
                        icon: 'cancel'
                    })
                );
            }
        };

        dispatch(
            showAlert({
                title: `¿Desea aprobar el buque '${item?.nombre}'?`,
                icon: 'info',
                cancelText: `${t('cancel')}`,
                confirmAction: approveShip
            })
        );
    };

    const handleRejectShip = (item: any) => {
        const rejectShip = async () => {
            const response: any = await editShip({
                idBuque: item?.id,
                data: {
                    aprobar: false,
                    nota: shipFullData?.rejectNote
                }
            });
            dispatch(
                showAlert({
                    title: response?.error ? '¡Algo salió mal!' : '¡Buque rechazado exitosamente!',
                    confirmText: 'Cerrar',
                    ...(response?.error && { message: response?.error?.data?.message || '' }),
                    ...(response?.error && { icon: 'cancel' })
                })
            );
            if (!response?.error) {
                setOpenRejectModal(null);
                refetchShipsData();
            }
        };

        dispatch(
            showAlert({
                title: `¿Desea rechazar el buque '${item?.nombre}'?`,
                icon: 'info',
                cancelText: `${t('cancel')}`,
                confirmAction: rejectShip
            })
        );
    };

    const downloadDocument = async (item: any) => {
        try {
            setDownloadingFile({ id: item.id });
            const response: any = await downloadCertificate({
                idBuque: itemSelected.id,
                idCertificate: item?.id
            });
            await fetch(response?.data?.presignedUrl)
                .then((response) => response.blob())
                .then((blob) => {
                    const name = `${
                        selected?.nombre || itemSelected?.nombre
                    }-${item?.tipoCertificado?.nombre.replace(/ /g, '-').toLowerCase()}${
                        item?.rutaAdjunto.match(FILE_EXTENSION)[0]
                    }`;
                    downloadFile({ blob, name });
                })
                .catch((error) => {
                    enqueueSnackbar('Ocurrió un problema', {
                        variant: 'error'
                    });
                });
        } catch (e: any) {
            enqueueSnackbar(e?.error?.data?.message || 'Ocurrió un problema', {
                variant: 'error'
            });
        } finally {
            setDownloadingFile(null);
        }
    };

    const handleApproveCertificate = async (idCertificate: number) => {
        try {
            const response: any = await editCertificate({
                idBuque: itemSelected.id,
                idCertificate: idCertificate,
                data: { aprobar: true }
            });

            if (!response?.error) {
                dispatch(
                    showAlert({
                        title: '¡Certificado aprobado exitosamente!',
                        confirmText: 'Cerrar'
                    })
                );
                refetchShipsData();
                getCertificatesByShipId(itemSelected);
            } else {
                dispatch(
                    showAlert({
                        title: 'Ocurrió un problema',
                        confirmText: 'Cerrar',
                        icon: 'cancel'
                    })
                );
            }
        } catch (e) {
            dispatch(
                showAlert({
                    title: 'Ocurrió un problema',
                    confirmText: 'Cerrar',
                    icon: 'cancel'
                })
            );
        }
    };

    const handleRejectCertificate = async (item: any) => {
        try {
            const response: any = await editCertificate({
                idBuque: itemSelected.id,
                idCertificate: item.id,
                data: { aprobar: false, nota: shipFullData?.rejectCertificateNote }
            });
            if (!response?.error) {
                dispatch(
                    showAlert({
                        title: '¡Certificado rechazado exitosamente!',
                        confirmText: 'Cerrar'
                    })
                );
                refetchShipsData();
                getCertificatesByShipId(itemSelected);
            } else {
                dispatch(
                    showAlert({
                        title: 'Ocurrió un problema',
                        confirmText: 'Cerrar',
                        icon: 'cancel'
                    })
                );
            }
            setOpenCertificateNoteDrawer(null);
        } catch (e) {
            console.error(e);
        }
    };

    const editCertificateData = async (item: any) => {
        try {
            const data = {
                fechaEmision: item?.fechaEmision,
                fechaVencimiento: item?.fechaVencimiento,
                numero: item?.numero,
                puntaje: item?.puntaje,
                ddjj: item?.ddjj,
                idEmisor: item?.emisor?.id
            };
            const response: any = await editCertificate({
                idBuque: itemSelected.id,
                idCertificate: item.id,
                data: data
            });
            if (!response?.error) {
                enqueueSnackbar('Datos de certificados actualizados', { variant: 'success' });
                setOpenEditCertificateDrawer(null);
                getCertificatesByShipId(itemSelected);
            } else {
                enqueueSnackbar(response?.error?.data?.message || 'Ocurrió un error', {
                    variant: 'error'
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleEditCertificate = async (action: string, item: any) => {
        if (action === 'approve') {
            dispatch(
                showAlert({
                    title: '¿Desea aprobar este certificado?',
                    icon: 'info',
                    cancelText: `${t('cancel')}`,
                    confirmText: 'Confirmar',
                    confirmAction: handleApproveCertificate,
                    itemData: item?.id
                })
            );
        }
        if (action === 'reject') {
            setOpenCertificateNoteDrawer({
                state: true,
                id: item.id,
                rejectCertificateNote: item?.nota?.nota,
                item: item
            });
        }
        if (action === 'edit') {
            setOpenEditCertificateDrawer({ state: true, item: item });
        }
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setMenuOpen(false);
        setItemSelected(null);
    };

    const loadingShip = useCallback(() => {
        return shipFullData?.id !== selected?.id && (isLoading || loadingShipFullData);
    }, [selected, isLoading, shipFullData, loadingShipFullData]);

    const handleChangeRejectCertificate = (e: any) => {
        const { value } = e.target;

        setShipFullData({
            ...shipFullData,
            rejectCertificateNote: value
        });
    };

    const handleClickAction = (event: any, item: any, index: any) => {
        setItemSelected(item);
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };

    return {
        data,
        agencies,
        openCard,
        selected,
        anchorEl,
        menuOpen,
        countries,
        isLoading,
        itemSelected,
        shipFullData,
        filteredItems,
        parametricData,
        downloadingFile,
        fetchingShipData,
        openRejectModal,
        shipCertificates,
        openCertificatesCard,
        openCertificateNoteDrawer,
        openEditCertificateDrawer,
        setData,
        editShip,
        loadingShip,
        setSelected,
        handleClickAction,
        setMenuOpen,
        setAnchorEl,
        setOpenCard,
        handleSelectRow,
        handleChange,
        setIsLoading,
        handleCloseMenu,
        handleOpenCard,
        setItemSelected,
        setFilteredItems,
        downloadDocument,
        handleManageMenu,
        handleRejectShip,
        handleApproveShip,
        handleCloseShipInfo,
        setOpenRejectModal,
        setShipCertificates,
        editCertificateData,
        handleEditCertificate,
        handleRejectCertificate,
        setOpenCertificatesCard,
        setOpenCertificateNoteDrawer,
        setOpenEditCertificateDrawer,
        handleChangeRejectCertificate,
        ...fetchProps
    };
}

export default useBuques;
