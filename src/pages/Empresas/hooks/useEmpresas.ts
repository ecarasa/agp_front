import { useEffect, useState } from 'react';
import {
    useEditEmpresaStateMutation,
    useGetEmpresaQuery,
    useGetEmpresasQuery,
    useGetParametricDataQuery
} from '../../../services/companyApi';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { showAlert } from '../../../features/slices/applicationSlice';
import { handleErrors } from '../../../utils/common';

export interface rowEmpresa {
    id: number;
    nombre: string;
    identificacionFiscal: string;
    categoriaFiscal: {
        id: number;
        nombre: string;
        codigo: string;
    };
    nombreComercial: string;
    activo: boolean | null;
    domicilio: string;
    email: string;
    telefono: string;
    idOrganizacion: number;
    ciudad: {
        id: number;
        nombre: string;
    };
    perfiles: [
        {
            id: number;
            nombre: string;
        }
    ];
    pais: {
        id: number;
        nombre: string;
    };
}
const useEmpresas = ({ filters }: any) => {
    const dispatch = useAppDispatch();
    const [selected, setSelected] = useState<rowEmpresa | null>(null);
    const [selectedItemFromAction, setSelectedItemFromAction] = useState<any>(null);
    const [openCard, setOpenCard] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [editState, { isLoading: edittingCompanyState }] = useEditEmpresaStateMutation();
    const { data: parametricData } = useGetParametricDataQuery();
    const { data: companyData, isLoading, isFetching } = useGetEmpresasQuery(filters);

    const {
        data: companyById,
        isLoading: loadingCompanyById,
        isFetching: fetchingCompanyById
    } = useGetEmpresaQuery(selected?.id, {
        skip: !selected
    });

    const handleOpenCard = (item: any) => {
        setOpenCard(true);
        setSelected(item);
    };

    const handleCloseCard = () => {
        setOpenCard(false);
        clearSelected();
    };

    useEffect(() => {
        if (openCard) handleCloseCard();
        // eslint-disable-next-line
    }, [filters]);

    const clearSelected = () => {
        setSelected(null);
        setSelectedItemFromAction(null);
    };

    const handleClickAction = (event: any, item: any, index: any) => {
        setSelectedItemFromAction(item);
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setMenuOpen(false);
        setSelectedItemFromAction(null);
    };

    const openModalConfirm = (event: any) => {
        const text: string = String(event.target.textContent);
        handleCloseMenu();
        dispatch(
            showAlert({
                title: `¿Desea ${text.toLowerCase()} esta empresa?`,
                confirmAction: changeCompanyState,
                itemData: text,
                confirmText: 'Aceptar',
                cancelText: 'Cerrar',
                icon: 'info',
                keepMounted: true
            })
        );
    };

    const changeCompanyState = async (text: any) => {
        const body = {
            activo:
                text === 'Activar'
                    ? true
                    : text === 'Desactivar'
                    ? false
                    : (selectedItemFromAction || selected)?.activo
        };

        const response: any = await editState({
            body,
            idEmpresa: (selectedItemFromAction || selected)?.id
        });
        if (!response?.error) {
            dispatch(
                showAlert({
                    title: `Empresa ${
                        text === 'Activar' ? 'activada' : text === 'Desactivar' ? 'desactivada' : ''
                    } correctamente`,
                    confirmText: 'Salir',
                    keepMounted: true
                })
            );
        } else {
            handleErrors(response.error);
        }
        if (selectedItemFromAction) setSelectedItemFromAction(null);
    };

    return {
        parametricData,
        selected,
        openCard,
        companyById,
        selectedItemFromAction,
        anchorEl,
        menuOpen,
        loadingCompanyById,
        fetchingCompanyById,
        companyData,
        isLoading,
        isFetching,
        edittingCompanyState,
        openModalConfirm,
        editState,
        setSelectedItemFromAction,
        setOpenCard,
        handleClickAction,
        handleOpenCard,
        setSelected,
        handleCloseMenu,
        handleCloseCard
    };
};

export default useEmpresas;
