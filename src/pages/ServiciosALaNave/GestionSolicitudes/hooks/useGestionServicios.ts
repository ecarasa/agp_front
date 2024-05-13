import { handleErrors } from '../../../../utils/common';
import { hideAlert, showAlert } from '../../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useEffect, useState } from 'react';
import useFetchs from './useFetchs';

interface ProvisionesProps {
    id: number;
    provisto: string | number;
    nombre: string;
    nota: string | null;
    obligatorio: boolean;
    tipo: string;
    activo: boolean;
    requiereAdjunto: boolean;
}

function useGestionServicios({ filters }: any) {
    const dispatch = useAppDispatch();
    const [selected, setSelected] = useState<any | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openCard, setOpenCard] = useState<boolean>(false);
    const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);
    const [provisiones, setProvisiones] = useState<ProvisionesProps[]>([]);
    const [selectedItemFromAction, setSelectedItemFromAction] = useState<any | null>(null);

    const { serviceData, requestById, logAttributes, cancelRequest, ...fetchProps } = useFetchs({
        selected,
        filters
    });

    useEffect(() => {
        if (openCard) handleCloseCard();
        // eslint-disable-next-line
    }, [filters]);

    const handleControlAccordion = (panel: string) => {
        setExpandedAccordion(expandedAccordion === panel ? false : panel);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, item: any) => {
        const { name, value } = e.target;

        let auxProvs = [...provisiones];
        let auxItem = { ...item };

        if (name) auxItem[name] = value;
        else auxItem.provisto = item?.tipo === 'N' ? Number(value) : value;

        const index = auxProvs.findIndex((i: any) => i?.id === item?.id);

        auxProvs.splice(index, 1, auxItem);

        setProvisiones(auxProvs);
    };

    useEffect(() => {
        if (requestById && serviceData) {
            if (requestById?.estado === 'PENDIENTE') {
                const atributos = serviceData.atributos
                    ?.filter((i: any) => i.activo)
                    ?.map((item: any) => ({
                        ...item,
                        provisto: null,
                        notaAtributo: item?.nota || '',
                        nota: ''
                    }));

                setProvisiones(atributos);
            } else {
                let auxAtributos: any = [];

                const atributos = serviceData.atributos?.map((item: any) => ({
                    ...item,
                    notaAtributo: item?.nota,
                    provisto: null
                }));

                atributos?.forEach((item: any) => {
                    const auxItem = requestById?.detalle?.find(
                        (i: any) => i?.atributo?.id === item?.id
                    );
                    if (auxItem) {
                        auxAtributos.push({
                            ...item,
                            provisto: auxItem?.provisto || '',
                            nota: auxItem?.nota || ''
                        });
                    }
                });

                setProvisiones(auxAtributos);
            }
        }
    }, [serviceData, requestById]);

    const clearSelected = () => {
        setSelected(null);
        setSelectedItemFromAction(null);
    };

    const handleCloseMenu = () => {
        setMenuOpen(false);
        setSelectedItemFromAction(null);
    };

    const handleClickAction = (event: any, item: any, index: any) => {
        setSelectedItemFromAction(item);
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };

    const handleActionMenu = (action?: string) => {
        setMenuOpen(false);
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

    const cancelRequestHandler = () => {
        const goBack = () => {
            handleCloseMenu();
            dispatch(hideAlert());
        };

        const submit = async () => {
            const response: any = await cancelRequest({
                requestId: selectedItemFromAction?.id,
                body: {
                    idEstado: 5
                }
            });
            if (!response?.error) {
                dispatch(
                    showAlert({
                        title: 'Solicitud cancelada correctamente',
                        keepMounted: true,
                        confirmText: 'Aceptar'
                    })
                );
            } else {
                handleErrors(response?.error);
            }
            handleCloseMenu();
        };

        dispatch(
            showAlert({
                title: `¿Desea cancelar la solicitud #${selectedItemFromAction?.id} para el buque ${selectedItemFromAction?.buque?.nombre}?`,
                keepMounted: true,
                confirmText: 'Aceptar',
                cancelText: 'Volver',
                cancelAction: goBack,
                confirmAction: submit,
                icon: 'info'
            })
        );
    };

    const handleLogProvisions = () => {
        const submit = async () => {
            const data: any = provisiones.map((item: any) => ({
                idAtributo: item.id,
                provisto: item?.tipo === 'N' ? Number(item?.provisto) || 0 : item?.provisto || '',
                nota: item?.nota
            }));

            const response: any = await logAttributes({
                requestId: selected?.id,
                body: { provisiones: data }
            });
            if (!response?.error) {
                dispatch(
                    showAlert({
                        title: 'Datos guardados correctamente',
                        keepMounted: true,
                        confirmText: 'Aceptar',
                        confirmAction: () => hideAlert()
                    })
                );
            } else {
                handleErrors(response.error);
            }
        };

        dispatch(
            showAlert({
                title: '¿Desea guardar la información?',
                keepMounted: true,
                confirmText: 'Guardar',
                cancelText: 'Cancelar',
                confirmAction: submit,
                icon: 'info'
            })
        );
    };

    const liquidado = requestById?.estado === 'LIQUIDADO';

    return {
        openCard,
        anchorEl,
        liquidado,
        menuOpen,
        selected,
        selectedItemFromAction,
        expandedAccordion,
        requestById,
        serviceData,
        provisiones,
        handleChange,
        handleControlAccordion,
        setMenuOpen,
        setSelected,
        handleSelectRow,
        cancelRequestHandler,
        setAnchorEl,
        setOpenCard,
        handleOpenCard,
        handleCloseCard,
        handleCloseMenu,
        handleActionMenu,
        handleClickAction,
        handleLogProvisions,
        ...fetchProps
    };
}

export default useGestionServicios;
