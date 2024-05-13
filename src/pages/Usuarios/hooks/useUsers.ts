import _ from 'lodash';
import { handleErrors } from '../../../utils/common';
import { showAlert } from '../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useEditUserMutation, useGetUsersQuery } from '../../../services/usersApi';
import { useEffect, useState } from 'react';
import { useGetCompanyRolesQuery } from '../../../services/CreateUser';

export interface rowUser {
    activo: boolean | null;
    bloqueado: boolean | null;
    confirmado: boolean | null;
    empresa: {
        id: number;
        nombre: string;
    };
    id: number;
    nombre: string;
    roles: [
        {
            id: number;
            nombre: string;
        }
    ];
    usuario: string;
}

const useUsers = ({ filters }: any) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [selected, setSelected] = useState<rowUser | null>(null);
    const [openCard, setOpenCard] = useState<boolean>(false);
    const [selectedItemFromAction, setSelectedItemFromAction] = useState<any>(null);

    const { data: parametricData } = useGetCompanyRolesQuery();
    const [editUserState, { isLoading: changingUserState }] = useEditUserMutation();
    const {
        data: usersData,
        isLoading,
        refetch: refetchUsers,
        isFetching
    } = useGetUsersQuery(filters);

    const handleClickAction = (event: any, item: any, index: any) => {
        setSelectedItemFromAction(item);
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };

    useEffect(() => {
        if (openCard) handleCloseCard();
        // eslint-disable-next-line
    }, [filters]);

    useEffect(() => {
        if (selected && usersData) {
            const updatedData = usersData?.data?.data?.find((i: any) => i.id === selected.id);
            if (!_.isEqual(selected, updatedData)) {
                setSelected(updatedData);
            }
        }
    }, [usersData, isLoading, isFetching, selected]);

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
        setMenuOpen(false);
        setSelectedItemFromAction(null);
    };

    const handleShowUserData = () => {
        setSelected(selectedItemFromAction);
        handleOpenCard();
        handleCloseMenu();
    };

    const openModalConfirm = (event: any) => {
        const text: string = String(event.target.textContent);
        setMenuOpen(false);
        setAnchorEl(null);
        dispatch(
            showAlert({
                title: `¿Deseas ${text.toLowerCase()} este usuario?`,
                confirmAction: changeUserState,
                itemData: text,
                confirmText: 'Aceptar',
                cancelText: 'Cerrar',
                icon: 'info',
                keepMounted: true
            })
        );
    };

    const changeUserState = async (text: any) => {
        const userRol = (selectedItemFromAction || selected).roles.map((objeto: any) => objeto.id);

        const body = {
            usuario: (selectedItemFromAction || selected)?.usuario,
            activo:
                text === 'Activar'
                    ? true
                    : text === 'Desactivar'
                    ? false
                    : (selectedItemFromAction || selected)?.activo,
            bloqueado:
                text === 'Bloquear'
                    ? true
                    : text === 'Desbloquear'
                    ? false
                    : (selectedItemFromAction || selected)?.bloqueado,
            idEmpresa: (selectedItemFromAction || selected)?.empresa.id,
            idsRol: userRol
        };

        const response: any = await editUserState(body);
        if (!response?.error) {
            dispatch(
                showAlert({
                    title: `Usuario ${
                        text === 'Activar'
                            ? 'activado'
                            : text === 'Desactivar'
                            ? 'desactivado'
                            : text === 'Bloquear'
                            ? 'bloqueado'
                            : text === 'Desbloquear'
                            ? 'desbloqueado'
                            : ''
                    } correctamente`,
                    confirmText: 'Aceptar',
                    keepMounted: true
                })
            );
        } else {
            handleErrors(response?.error);
        }
        if (selectedItemFromAction) setSelectedItemFromAction(null);
    };

    return {
        selected,
        parametricData,
        selectedItemFromAction,
        usersData,
        openCard,
        anchorEl,
        menuOpen,
        isLoading,
        isFetching,
        changingUserState,
        handleSelectRow,
        setOpenCard,
        handleCloseMenu,
        editUserState,
        openModalConfirm,
        handleShowUserData,
        handleCloseCard,
        handleClickAction,
        refetchUsers
    };
};

export default useUsers;
