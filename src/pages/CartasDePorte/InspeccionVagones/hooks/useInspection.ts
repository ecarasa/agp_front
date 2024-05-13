import _ from 'lodash';
import { handleErrors } from '../../../../utils/common';
import { showAlert } from '../../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    useGetRejectMotivesQuery,
    useGetWaybillByIdQuery,
    useUpdateWaybillWagonMutation
} from '../../../../services/railwaysApi';

type ExtraInfo = {
    nota?: string;
    idMotivoRechazo?: number;
    aprobar?: boolean;
};

const actionValues: { [key: string]: { [key: string]: string } } = {
    aprobar: { name: 'aprobado', operation: 'A' },
    observar: { name: 'observado', operation: 'O' },
    resolver: { name: 'resuelto', operation: 'R' }
};

function useInspection({ filters }: any) {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const [openDialog, setOpenDialog] = useState<string | null>(null);
    const [extraInfo, setExtraInfo] = useState<ExtraInfo | null>(null);
    const [openCard, setOpenCard] = useState<boolean>(false);
    const [updateItem, setUpdateItem] = useState<boolean>(false);
    const [selected, setSelected] = useState<any>(null);
    const [openMenu, setOpenMenu] = useState<any>(false);
    const [filteredData, setFilteredData] = useState<any>([]);
    const [updateWaybillWagon, { isLoading: updatingWaybillWagon }] =
        useUpdateWaybillWagonMutation();
    const { data: rejectMotives, isLoading: loadingRejectMotives } = useGetRejectMotivesQuery({});

    const {
        data,
        isLoading: loadingWaybill,
        isFetching: fetchingWaybill,
        refetch
    } = useGetWaybillByIdQuery(id);

    useEffect(() => {
        if (selected && updateItem) {
            const item = data?.vagones?.find((i: any) => i.nroVagon === selected?.nroVagon);
            if (
                !!item?.inspeccion?.estado &&
                item?.inspeccion?.estado !== selected?.inspeccion?.estado
            ) {
                setSelected(item);
                setUpdateItem(false);
            }
        }
        // eslint-disable-next-line
    }, [data, selected, updateItem]);

    useEffect(() => {
        if (!_.isEmpty(filters)) {
            let auxData: any = [];

            if (filters?.state && filters?.search) {
                auxData = data?.vagones?.filter(
                    (i: any) =>
                        (i?.inspeccion?.estado === filters?.state ||
                            i?.estado === filters?.state) &&
                        i?.nroVagon
                            .concat(',', i?.nroContenedor)
                            ?.concat(',', i?.nroPrecinto)
                            ?.concat(',', i?.colorPrecinto)
                            ?.toLowerCase()
                            ?.includes(filters?.search?.trim()?.toLowerCase())
                );
            } else {
                if (filters?.state) {
                    auxData = data?.vagones?.filter(
                        (i: any) =>
                            i?.inspeccion?.estado === filters?.state || i?.estado === filters?.state
                    );
                }
                if (filters?.search) {
                    auxData = data?.vagones?.filter((i: any) =>
                        i?.nroVagon
                            .concat(',', i?.nroContenedor)
                            ?.concat(',', i?.nroPrecinto)
                            ?.concat(',', i?.colorPrecinto)
                            ?.toLowerCase()
                            ?.includes(filters?.search?.trim()?.toLowerCase())
                    );
                }
            }
            setFilteredData(auxData);
        } else {
            setFilteredData([]);
        }
        // eslint-disable-next-line
    }, [filters]);

    const handleOpenCard = () => setOpenCard(true);

    const handleCloseCard = () => {
        setOpenCard(false);
        clearSelected();
    };

    const clearSelected = () => setSelected(null);

    const handleSelectRow = (item: any) => {
        window.scrollTo(0, 0);
        setSelected(item);
        handleOpenCard();
    };

    const handleCloseMenu = () => setOpenMenu(false);

    const handleChange = (e: any) => {
        const { name, value } = e?.target;
        setExtraInfo({
            ...extraInfo,
            [name]: value
        });
    };

    const handleSubmit = async (action: string) => {
        try {
            let data: any = { ...extraInfo };
            data = { ...data, operacion: actionValues[action].operation };

            if (action === 'resolver') delete data?.idMotivoRechazo;

            const response: any = await updateWaybillWagon({
                waybillId: id,
                wagonNumber: selected?.nroVagon,
                body: data
            });
            if (response?.error) {
                handleErrors(response?.error);
            } else {
                handleCloseDialog();
                setUpdateItem(true);
                dispatch(
                    showAlert({
                        title: `Vagón ${actionValues[action].name} correctamente`,
                        keepMounted: true,
                        confirmText: 'Cerrar'
                    })
                );
                refetch();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleAction = (action: string) => {
        setOpenDialog(action);
        if (selected?.inspeccion && selected?.inspeccion?.estado === 'Observado') {
            setExtraInfo({
                idMotivoRechazo: selected?.inspeccion?.tipoInconveniente?.id
            });
        }
    };

    const handleCloseDialog = () => {
        clearDialogForm();
        setOpenDialog(null);
    };

    const clearDialogForm = () => {
        setExtraInfo(null);
    };

    return {
        data,
        extraInfo,
        fetchingWaybill,
        loadingRejectMotives,
        loadingWaybill,
        openCard,
        openDialog,
        openMenu,
        filteredData,
        rejectMotives,
        selected,
        updatingWaybillWagon,
        handleAction,
        clearDialogForm,
        handleCloseDialog,
        handleSubmit,
        handleChange,
        handleCloseCard,
        handleSelectRow,
        handleCloseMenu
    };
}

export default useInspection;
