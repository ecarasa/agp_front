import { useEffect, useState } from 'react';
import {
    useGetPatentsQuery,
    useLazyGetConversationQuery,
    useUnsubscribePatentMutation
} from '../../../services/patentsApi';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { hideAlert, showAlert } from '../../../features/slices/applicationSlice';
import { handleErrors } from '../../../utils/common';
import useUserAccess from '../../../hooks/useUserAccess';

const usePatents = ({ filters }: any) => {
    const dispatch = useAppDispatch();
    const access = useUserAccess();
    const [selected, setSelected] = useState<any>(null);
    const [openMenu, setOpenMenu] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openCard, setOpenCard] = useState(false);
    const [historyConversation, setHistoryConversation] = useState(null);
    const [detailDrawer, setDetailDrawer] = useState<any | null>();

    const [selectedItemFromAction, setSelectedItemFromAction] = useState<any | null>(null);
    const {
        data: patents,
        isLoading: loadingPatents,
        isFetching: fetchingPatents,
        refetch
    } = useGetPatentsQuery({ filters }, { refetchOnMountOrArgChange: true });

    const [getConversation, { isFetching: fetchingHistoryConversation }] =
        useLazyGetConversationQuery();
    const [editPatent, { isLoading: unsubscribingPatent }] = useUnsubscribePatentMutation();

    const loadConversation = async () => {
        try {
            const response: any = await getConversation(selected?.id);
            if (response) setHistoryConversation(response?.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (openCard) handleCloseCard();
        // eslint-disable-next-line
    }, [filters]);

    useEffect(() => {
        if (selected) loadConversation();
        // eslint-disable-next-line
    }, [selected]);
    const handleClickAction = (event: any, item: any, index: any) => {
        setSelectedItemFromAction(item);
        setAnchorEl(event.currentTarget);
        setOpenMenu(true);
    };

    const clearSelected = () => {
        setSelected(null);
        setSelectedItemFromAction(null);
    };

    const handleOpenCard = () => {
        setOpenCard(true);
    };

    const handleCloseCard = () => {
        setOpenCard(false);
        clearSelected();
    };

    const handleSelectRow = (item: any) => {
        setSelected(item);
        handleOpenCard();
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setOpenMenu(false);
        setSelectedItemFromAction(null);
    };

    const handleActionMenu = (action?: string) => {
        setOpenMenu(false);
        if (action === 'history') {
            setSelected(selectedItemFromAction);
            setOpenCard(true);
        }
    };

    const handleJudicializePatent = async () => {
        handleCloseMenu();

        const refetchPatents = () => {
            refetch();
            handleCloseMenu();
        };

        const judicialize = async () => {
            const data = { patentId: selectedItemFromAction?.id, body: { judicializar: true } };
            const response: any = await editPatent(data);
            if (!response?.error) {
                dispatch(
                    showAlert({
                        title: 'Patente judicializada',
                        confirmText: 'Aceptar',
                        confirmAction: refetchPatents,
                        keepMounted: true
                    })
                );
            } else {
                handleErrors(response?.error);
            }
        };

        dispatch(
            showAlert({
                title: '¿Desea judicializar patente?',
                confirmText: 'Aceptar',
                cancelText: 'Cancelar',
                icon: 'info',
                confirmAction: judicialize,
                cancelAction: () => dispatch(hideAlert()),
                keepMounted: true
            })
        );
    };

    const handleUnsubscribe = async () => {
        handleCloseMenu();

        const refetchPatents = () => {
            refetch();
            handleCloseMenu();
        };

        const unsubscribe = async () => {
            const data = { patentId: selectedItemFromAction?.id, body: { esBaja: true } };
            const response: any = await editPatent(data);
            if (!response?.error) {
                dispatch(
                    showAlert({
                        title: '¡Solicitud de baja realizada correctamente!',
                        confirmText: 'Aceptar',
                        confirmAction: refetchPatents,
                        keepMounted: true
                    })
                );
            } else {
                handleErrors(response?.error);
            }
        };

        dispatch(
            showAlert({
                title: '¿Solicitar baja de patente?',
                confirmText: 'Aceptar',
                cancelText: 'Cancelar',
                icon: 'info',
                confirmAction: unsubscribe,
                cancelAction: () => dispatch(hideAlert()),
                keepMounted: true
            })
        );
    };

    const handleOpenDetailDrawer = (item: any) => {
        if (detailDrawer) setDetailDrawer(null);
        else if (item) setDetailDrawer(item);
        else return;
    };

    return {
        selected,
        access,
        patents,
        loadingPatents,
        fetchingPatents,
        openMenu,
        anchorEl,
        unsubscribingPatent,
        openCard,
        detailDrawer,
        historyConversation,
        fetchingHistoryConversation,
        selectedItemFromAction,
        handleOpenDetailDrawer,
        handleClickAction,
        handleUnsubscribe,
        handleSelectRow,
        handleCloseCard,
        handleCloseMenu,
        handleActionMenu,
        handleJudicializePatent,
        handleOpenCard
    };
};

export default usePatents;
