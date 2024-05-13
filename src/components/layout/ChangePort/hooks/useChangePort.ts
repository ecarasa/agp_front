import { useState } from 'react';
import {
    useChangeUserPortMutation,
    useGetUserPortsQuery,
    useLazyGetUserDataQuery
} from '../../../../services/usersApi';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { showAlert } from '../../../../features/slices/applicationSlice';
import { handleErrors } from '../../../../utils/common';
import { setUserData } from '../../../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

function useChangePort({ user }: any) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [selected, setSelected] = useState<any>(null);
    const [openPortsDrawer, setOpenPortsDrawer] = useState<boolean>(false);
    const {
        data: ports,
        isLoading: loadingUserPorts,
        isFetching: fetchingUserPorts,
        refetch: refetchPorts
    } = useGetUserPortsQuery(undefined, { refetchOnMountOrArgChange: true });
    const [changeUserPort, { isLoading: changingPort }] = useChangeUserPortMutation();
    const [getUserData, { isLoading: loadingUserData }] = useLazyGetUserDataQuery();

    const handleOpenPortsDrawer = () => {
        setOpenPortsDrawer(!openPortsDrawer);
        if (!openPortsDrawer) setSelected(null);
    };

    const handleChangePort = (e: any) => {
        if (!e?.target?.value) return setSelected(null);
        setSelected(e?.target?.value);
    };

    const updateUserData = async () => {
        const response = await getUserData();
        if (!response?.error) {
            dispatch(setUserData(response?.data?.data));
            navigate(0);
        } else {
            handleErrors(response?.error);
        }
    };

    const handleSubmit = () => {
        const successRequest = () => {
            handleOpenPortsDrawer();
            dispatch(
                showAlert({
                    title: '¡Se cambió el puerto de operación correctamente!',
                    confirmText: 'Aceptar',
                    confirmAction: updateUserData,
                    keepMounted: true
                })
            );
        };

        const submit = async () => {
            const response: any = await changeUserPort({ idOrganizacion: selected });
            if (!response?.error) {
                successRequest();
            } else {
                handleErrors(response?.error);
            }
        };

        dispatch(
            showAlert({
                title: '¿Confirma que desea cambiar el puerto a operar?',
                confirmText: 'Confirmar',
                cancelText: 'Cancelar',
                confirmAction: submit,
                keepMounted: true,
                icon: 'info'
            })
        );
    };

    return {
        selected,
        ports,
        fetchingUserPorts,
        loadingUserPorts,
        openPortsDrawer,
        changingPort,
        loadingUserData,
        handleSubmit,
        handleChangePort,
        refetchPorts,
        handleOpenPortsDrawer
    };
}

export default useChangePort;
