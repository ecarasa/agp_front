import {
    useEditComunicacionEventosMutation,
    useGetComunicacionesEventosQuery
} from '../../services/companyApi';
import { Box, Grid, Menu, MenuItem } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { showAlert } from '../../features/slices/applicationSlice';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { useEffect, useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useTranslation } from 'react-i18next';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ComunicacionInformation from './components/ComunicacionInformation';
import DataTable from '../../components/DataTable/DataTable';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import SearchToolbar from '../../components/SearchToolbar/SearchToolbar';
import SectionHeader from '../../components/SectionHeader';
import useGlobalFilters from '../../hooks/useGlobalFilters';
import useUserAccess from '../../hooks/useUserAccess';

export interface Root {
    comunicacionesEventos: ComunicacionesEvento[];
}

export interface ComunicacionesEvento {
    id: number;
    mail: boolean;
    push: boolean;
    notificacion: boolean;
    activo: boolean;
    titulo: string;
    mensaje: string;
    mensajeCorto: string;
    urlRedireccion: string;
    tipoEvento: TipoEvento;
    notificacionesUsuarios: any[];
    notificacionesEmpresas: NotificacionesEmpresa[];
    remplazoTitulo?: string[];
    remplazoMensaje?: string[];
}

export interface TipoEvento {
    id: number;
    evento: string;
    idAgrupador: number;
}

export interface NotificacionesEmpresa {
    activo: boolean;
    empresaUnica: boolean;
    prefil: Prefil;
    notificacionesRoles: NotificacionesRole[];
}

export interface Prefil {
    id: number;
    nombre: string;
}

export interface NotificacionesRole {
    rol: Rol;
    activo: boolean;
}

export interface Rol {
    id: number;
}

function ComunicacionesEventosIndex() {
    const { t } = useTranslation('communications');
    const access = useUserAccess();
    const dispatch = useAppDispatch();

    const [editComunicacionData] = useEditComunicacionEventosMutation();

    const { isMobile, isTablet } = useIsMobile();
    const [isActive, setIsActive] = useState(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [selected, setSelected] = useState<ComunicacionesEvento | null>(null);
    const [abrirCard, setAbrirCard] = useState(false);
    const [itemSelected, setItemSelected] = useState<any>(null);
    const [mainData, setMainData] = useState<any>();

    const [inputText, setInputText] = useState<string | null>(null);

    const { filters, setFilters } = useGlobalFilters();

    const {
        data: communicationData,
        isLoading,
        refetch,
        isFetching
    } = useGetComunicacionesEventosQuery({ refetchOnMountOrArgChange: true });

    const handleOpenCard = (item: any) => {
        setAbrirCard(true);
        setSelected(item);
    };

    const handleCloseCard = () => {
        setAbrirCard(false);
        setSelected(null);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setMenuOpen(false);
        setItemSelected(null);
    };

    const openModalConfirm = (event: any) => {
        const text: string = String(event.target.textContent);
        setMenuOpen(false);
        setAnchorEl(null);
        dispatch(
            showAlert({
                message: `Está por ${text.toLowerCase()} una comunicación`,
                title: `¿Deseas ${text.toLowerCase()} a esta comunicación?`,
                confirmAction: changeCommState,
                itemData: text,
                confirmText: 'Aceptar',
                cancelText: 'Cerrar',
                icon: 'info',
                keepMounted: true
            })
        );
    };

    const changeCommState = async (text: any) => {
        try {
            const response: any = await editComunicacionData({
                body: {
                    activo:
                        text === 'Activar'
                            ? true
                            : text === 'Desactivar'
                            ? false
                            : itemSelected?.activo
                },
                idCertificado: itemSelected?.id
            });
            if (!response?.error) {
                dispatch(
                    showAlert({
                        title: `Comunicación ${
                            text === 'Activar'
                                ? 'activada'
                                : text === 'Desactivar'
                                ? 'desactivada'
                                : ''
                        } exitosamente`,
                        confirmText: 'Salir',
                        keepMounted: true
                    })
                );
            } else {
                enqueueSnackbar('Ocurrió un error', { variant: 'error' });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setAbrirCard(false);
            setItemSelected(null);
        }
    };

    const handleClickAction = (event: any, item: any, index: any) => {
        setItemSelected(item);
        setIsActive(item.activo);
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };

    const getStateIcon = (item: any) => {
        if (item?.activo) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'inherit',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <CheckCircleIcon sx={{ color: '#6EBE64' }} fontSize="small" />
                    <Box>Activo</Box>
                </Box>
            );
        } else {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'inherit', gap: 1 }}>
                    <CancelIcon sx={{ color: '#D40000' }} fontSize="small" />
                    <Box>Inactivo</Box>
                </Box>
            );
        }
    };

    const getPushIcons = (item: any) => {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'inherit', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'inherit' }}>
                    <NotificationImportantIcon
                        sx={{ color: item?.notificacion ? '#3761ED' : '#B2B2B2' }}
                        fontSize="small"
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'inherit' }}>
                    <InfoIcon sx={{ color: item?.push ? '#3761ED' : '#B2B2B2' }} fontSize="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'inherit', alignItems: 'center' }}>
                    <EmailIcon
                        sx={{ color: item?.mail ? '#3761ED' : '#B2B2B2' }}
                        fontSize="small"
                    />
                </Box>
            </Box>
        );
    };

    const formatResponse = (info: any) => {
        const data = info?.data?.comunicacionesEventos;
        return { ...info, data: { data } };
    };

    /**Searchbar */
    const searchInputHandler = (e: any) => {
        const inputSearchText = e?.target?.value?.toLowerCase();
        setInputText(inputSearchText);
        checkData(inputSearchText);
    };

    const filterData = (input: any) => {
        const filtered = communicationData?.data?.comunicacionesEventos?.filter((el: any) => {
            return (
                el.tipoEvento?.evento?.toLowerCase().includes(input) ||
                el.titulo.toLowerCase().includes(input)
            );
        });
        return { data: { data: filtered || [] } };
    };

    const checkData = (text: any) => {
        setMainData(!text ? formatResponse(communicationData) : filterData(text));
    };

    useEffect(() => {
        checkData(null);
        // eslint-disable-next-line
    }, [communicationData]);
    /********************************** */

    return (
        <>
            <SectionHeader>
                <SectionHeader.Title>{t('titleEvent')}</SectionHeader.Title>
            </SectionHeader>

            <Grid
                container
                direction={isMobile ? 'column-reverse' : 'row'}
                justifyContent="center"
                alignItems="center"
                spacing={3}
                sx={{
                    '& .MuiGrid-root': {
                        width: '100%'
                    }
                }}
            >
                <Grid item xs={12} sx={{ margin: '0 0 15px 0' }}>
                    <SearchToolbar
                        inputSearchName="nombre"
                        placeHolder="Evento"
                        hiddeButtons={true}
                        hideFilterButton={true}
                        onClick={console.log}
                        clearFilters={console.log}
                        onChange={searchInputHandler}
                    >
                        <></>
                    </SearchToolbar>
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="flex-start"
                spacing={3}
            >
                {abrirCard && (isMobile || isTablet) ? (
                    ''
                ) : (
                    <Grid item xs={abrirCard ? 6 : 12} lg={abrirCard ? 8 : 12}>
                        <DataTable
                            headers={[
                                {
                                    type: 'data',
                                    width: 32,
                                    upperLabel: (item: any) => item?.tipoEvento?.evento
                                },
                                {
                                    type: 'element',
                                    width: 10,
                                    align: 'center',
                                    template: (item: any) => {
                                        return getStateIcon(item);
                                    }
                                },
                                {
                                    type: 'element',
                                    width: 2,
                                    align: 'center',
                                    template: (item: any) => {
                                        return getPushIcons(item);
                                    }
                                },
                                {
                                    type: 'data',
                                    upperLabel: (item: any) => item?.titulo,
                                    width: 28,
                                    align: 'right'
                                },
                                {
                                    type: 'action',
                                    onClick: handleClickAction
                                }
                            ]}
                            onSelectRow={(item: any) => {
                                handleOpenCard(item);
                            }}
                            isLoading={isLoading}
                            items={mainData}
                            filters={filters}
                            setFilters={setFilters}
                            isFetching={isFetching}
                            selected={selected}
                            noPaginated={true}
                        />
                    </Grid>
                )}
                {abrirCard && (
                    <Grid
                        item
                        xs={!isMobile && !isTablet ? 6 : 12}
                        lg={!isMobile && !isTablet ? 4 : 12}
                    >
                        <ComunicacionInformation
                            communicationData={selected}
                            onClose={() => handleCloseCard()}
                            cambioEstado={openModalConfirm}
                            refrescarDatos={refetch}
                            setAbrirCard={setAbrirCard}
                        />
                    </Grid>
                )}
            </Grid>
            <Menu id="basic-menu" anchorEl={anchorEl} open={menuOpen} onClose={handleCloseMenu}>
                <Box>
                    <MenuItem onClick={(event) => openModalConfirm(event)}>
                        {isActive ? 'Desactivar' : 'Activar'}
                    </MenuItem>
                </Box>
                {!!access?.[2]?.[42] && (
                    <MenuItem
                        onClick={() => {
                            setAbrirCard(true);
                            setAnchorEl(null);
                            setMenuOpen(false);
                            setSelected(itemSelected);
                        }}
                    >
                        Editar
                    </MenuItem>
                )}
            </Menu>
        </>
    );
}

export default ComunicacionesEventosIndex;
