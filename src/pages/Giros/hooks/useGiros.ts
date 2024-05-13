import { handleErrors } from '../../../utils/common';
import { useEffect, useState } from 'react';
import { useGetGirosQuery, useLazyHistoryConversationQuery } from '../../../services/girosApi';
import { useGetAgenciesQuery, useGetParametricDataQuery } from '../../../services/shipsApi';

function useGiros({ filters }: any) {
    const [selected, setSelected] = useState<any | null>(null);
    const [openMenu, setOpenMenu] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openCard, setOpenCard] = useState(false);
    const [selectedItemFromAction, setSelectedItemFromAction] = useState<any | null>(null);
    const [historyConversation, setHistoryConversation] = useState(null);
    const [detailDrawer, setDetailDrawer] = useState<any | null>();
    const { data: shipParametrics, isLoading: loadingShipParametrics } = useGetParametricDataQuery(
        {}
    );
    const { data: agencies, isLoading: loadingAgencies } = useGetAgenciesQuery(undefined);
    const [getHistoryConversation, { isFetching: fetchingHistoryConversation }] =
        useLazyHistoryConversationQuery();

    const {
        data: dataGiros,
        isLoading: loadingGirosData,
        isFetching: fetchinGirosData
    } = useGetGirosQuery(
        { filters },
        {
            refetchOnMountOrArgChange: true
        }
    );

    useEffect(() => {
        if (openCard) handleCloseCard();
        // eslint-disable-next-line
    }, [filters]);

    const loadConversation = async () => {
        try {
            const response: any = await getHistoryConversation(selected?.id);
            if (!response?.error) setHistoryConversation(response?.data);
            else handleErrors(response?.error);
        } catch (e) {
            console.error(e);
        }
    };

    const handleOpenDetailDrawer = (item: any) => {
        if (detailDrawer) setDetailDrawer(null);
        else if (item) setDetailDrawer(item);
        else return;
    };

    useEffect(() => {
        if (selected) loadConversation();
        // eslint-disable-next-line
    }, [selected]);

    const clearSelected = () => {
        setSelected(null);
        setSelectedItemFromAction(null);
    };

    const handleCloseMenu = () => {
        setOpenMenu(false);
        setSelectedItemFromAction(null);
    };

    const handleClickAction = (event: any, item: any, index: any) => {
        setSelectedItemFromAction(item);
        setAnchorEl(event.currentTarget);
        setOpenMenu(true);
    };

    const handleActionMenu = (action?: string) => {
        setOpenMenu(false);
        if (action === 'history') {
            setSelected(selectedItemFromAction);
            setOpenCard(true);
        }
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

    return {
        agencies,
        anchorEl,
        dataGiros,
        detailDrawer,
        fetchingHistoryConversation,
        fetchinGirosData,
        historyConversation,
        loadingAgencies,
        loadingGirosData,
        loadingShipParametrics,
        openCard,
        openMenu,
        selected,
        selectedItemFromAction,
        shipParametrics,
        setOpenMenu,
        setSelected,
        setAnchorEl,
        setOpenCard,
        handleOpenCard,
        handleCloseCard,
        handleSelectRow,
        handleCloseMenu,
        handleActionMenu,
        handleClickAction,
        handleOpenDetailDrawer
    };
}

export default useGiros;
