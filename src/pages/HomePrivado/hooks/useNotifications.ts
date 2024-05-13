import { useEffect, useState } from 'react';
import { useGetNotificationsQuery, useSetReadMutation } from '../../../services/notificationsApi';
import useGlobalFilters from '../../../hooks/useGlobalFilters';

function useNotifications() {
    const { filters, setFilters } = useGlobalFilters();
    const [notifications, setNotifications] = useState<any>(null);
    const [openNotificationsMenu, setOpenNotificationsMenu] = useState<boolean>(false);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [selected, setSelected] = useState<any>(null);
    const [newNotification, setNewNotification] = useState<boolean>(false);
    const [notificationsUpdated, setNotificationsUpdated] = useState<boolean>(false);
    const [setRead, { isLoading: updatingNotifications }] = useSetReadMutation();

    const {
        data,
        isLoading: loadingNotifications,
        isFetching: fetchingNotifications,
        refetch
    } = useGetNotificationsQuery({ filters }, { refetchOnMountOrArgChange: true });

    useEffect(() => {
        if (newNotification || openNotificationsMenu) refetch();
        // eslint-disable-next-line
    }, [newNotification, openNotificationsMenu]);

    useEffect(() => {
        if (data) {
            setNotifications(data);
            if (notifications) setNotificationsUpdated(true);

            if (newNotification) setNewNotification(false);
        }
        // eslint-disable-next-line
    }, [data]);

    useEffect(() => {
        if (notificationsUpdated) {
            setTimeout(() => {
                setNotificationsUpdated(false);
            }, 2000);
        }
    }, [notificationsUpdated]);

    const setNotificationRead = async (id: string) => {
        try {
            await setRead(Number(id));
        } catch (e) {
            console.error(e);
        }
    };

    const handleOpenDrawer = (item: any) => {
        if (!item?.fechaLectura) setNotificationRead(item?.id);
        setSelected(item);
        setOpenDrawer(true);
    };

    const handleCloseDrawer = () => {
        setOpenDrawer(false);
        setSelected(null);
    };

    return {
        selected,
        filters,
        openDrawer,
        notifications,
        newNotification,
        loadingNotifications,
        notificationsUpdated,
        fetchingNotifications,
        updatingNotifications,
        openNotificationsMenu,
        setFilters,
        setOpenNotificationsMenu,
        setOpenDrawer,
        setSelected,
        setNotifications,
        handleOpenDrawer,
        handleCloseDrawer,
        setNewNotification
    };
}

export default useNotifications;
