import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { showAlert } from '../../../features/slices/applicationSlice';
import {
    useDeleteRailwayMutation,
    useGetCompaniesQuery,
    useGetFormacionesFerroviariasQuery,
    useGetParrillasQuery
} from '../../../services/railwaysApi';
import { handleErrors } from '../../../utils/common';

function useFormaciones({ filters }: any) {
    const dispatch = useAppDispatch();
    const [openCard, setOpenCard] = useState<boolean>(false);
    const { data: parrillas, isLoading: loadingParrillas } = useGetParrillasQuery({});
    const [openMenu, setOpenMenu] = useState<any>(false);
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [selected, setSelected] = useState<any>(null);
    const [selectedItemFromAction, setSelectedItemFromAction] = useState<any | null>(null);
    const [removeRailway, { isLoading: deletingRailway }] = useDeleteRailwayMutation();
    const {
        data: formacionesFerroviarias,
        isLoading: loadingFormaciones,
        isFetching: fetchingFormaciones
    } = useGetFormacionesFerroviariasQuery({ filters }, { refetchOnMountOrArgChange: true });
    const { data: agenciasFerroviarias, isLoading: loadingAgencies } = useGetCompaniesQuery({
        filters: { perfil: 11 }
    });

    useEffect(() => {
        if (openCard) handleCloseCard();
        // eslint-disable-next-line
    }, [filters]);

    const handleClickAction = (event: any, item: any, index: any) => {
        setSelectedItemFromAction(item);
        setAnchorEl(event.currentTarget);
        setOpenMenu(true);
    };

    const handleCloseCard = () => {
        setOpenCard(false);
        clearSelected();
    };

    const clearSelected = () => {
        setSelected(null);
        setSelectedItemFromAction(null);
    };

    const handleOpenCard = () => setOpenCard(true);

    const handleSelectRow = (item: any) => {
        setSelected(item);
        if (selectedItemFromAction) setSelectedItemFromAction(null);
        handleOpenCard();
    };

    const handleCloseMenu = () => {
        setOpenMenu(false);
        setSelectedItemFromAction(null);
    };

    const handleDelete = (item: any) => {
        const deleteRailway = async () => {
            const response: any = await removeRailway(item?.id);
            if (!response?.error) {
                handleCloseCard();
                dispatch(
                    showAlert({
                        title: 'Formación eliminada correctamente',
                        keepMounted: true,
                        confirmText: 'Aceptar'
                    })
                );
            } else {
                handleErrors(response?.error);
            }
        };

        dispatch(
            showAlert({
                title: '¿Desea eliminar la formación?',
                keepMounted: true,
                confirmText: 'Eliminar',
                confirmAction: deleteRailway,
                cancelText: 'Cancelar',
                icon: 'info'
            })
        );
    };

    return {
        openCard,
        parrillas,
        selected,
        loadingParrillas,
        openMenu,
        anchorEl,
        formacionesFerroviarias,
        loadingFormaciones,
        fetchingFormaciones,
        selectedItemFromAction,
        deletingRailway,
        agenciasFerroviarias,
        loadingAgencies,
        handleClickAction,
        handleCloseMenu,
        handleCloseCard,
        handleSelectRow,
        handleDelete
    };
}

export default useFormaciones;
