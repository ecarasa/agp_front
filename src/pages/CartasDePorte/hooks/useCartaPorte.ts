import { downloadBase64File, handleErrors } from '../../../utils/common';
import { showAlert } from '../../../features/slices/applicationSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    useGetWaybillByIdQuery,
    useGetWaybillsQuery,
    useLazyDownloadWaybillFileQuery
} from '../../../services/railwaysApi';

type Props = {
    filters?: object | undefined;
};
function useCartaPorte({ filters }: Props) {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const userCompany = useAppSelector((state) => state?.auth?.user?.empresa);
    const isAGP = userCompany?.id === 1;
    const [openCard, setOpenCard] = useState<boolean>(false);
    const [selected, setSelected] = useState<any>(null);
    const [openMenu, setOpenMenu] = useState<any>(false);
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [selectedItemFromAction, setSelectedItemFromAction] = useState<any | null>(null);
    const {
        data: cartaPorteById,
        isLoading: loadingWaybill,
        isFetching: fetchingWaybill,
        isError
    } = useGetWaybillByIdQuery(selected?.id, { skip: !selected });

    const [downloadWaybillFile, { isLoading: downloadingWaybillFile }] =
        useLazyDownloadWaybillFileQuery();

    const {
        data: cartasPorte,
        isLoading: loadingCartasPorte,
        isFetching: fetchingCartasPorte,
        refetch: updateTable
    } = useGetWaybillsQuery({ filters }, { refetchOnMountOrArgChange: true });

    const handleOpenCard = () => setOpenCard(true);

    useEffect(() => {
        if (openCard) handleCloseCard();
        // eslint-disable-next-line
    }, [filters]);

    const handleCloseCard = () => {
        setOpenCard(false);
        clearSelected();
    };

    const clearSelected = () => {
        setSelected(null);
        setSelectedItemFromAction(null);
    };

    const handleClickAction = (event: any, item: any, index: any) => {
        setSelectedItemFromAction(item);
        setAnchorEl(event.currentTarget);
        setOpenMenu(true);
    };

    const handleSelectRow = (item: any) => {
        setSelected(item);
        if (selectedItemFromAction) setSelectedItemFromAction(null);
        handleOpenCard();
    };

    const handleCloseMenu = () => {
        setOpenMenu(false);
        setSelectedItemFromAction(null);
    };

    const downloadFile = (rowId: string) => {
        handleCloseMenu();
        const handleDownloadPDF = async () => {
            try {
                const response: any = await downloadWaybillFile(rowId);
                if (!response?.error) {
                    downloadBase64File(response?.data, Number(rowId), 'carta-de-porte');
                    if (!id) await updateTable();
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

    return {
        isAGP,
        cartaPorteById,
        isError,
        loadingWaybill,
        fetchingWaybill,
        openCard,
        selected,
        anchorEl,
        openMenu,
        cartasPorte,
        loadingCartasPorte,
        downloadingWaybillFile,
        fetchingCartasPorte,
        selectedItemFromAction,
        handleCloseCard,
        downloadFile,
        handleOpenCard,
        handleCloseMenu,
        handleClickAction,
        handleSelectRow
    };
}

export default useCartaPorte;
