import { getDateTime } from '../../utils/common';
import { getDockingObservedIcons, getDockingRenewalIcon } from '../../utils/functions';
import { Grid, Menu, MenuItem } from '@mui/material';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DataTable from '../../components/DataTable/DataTable';
import GirosFilters from './components/GirosFilters';
import HistoryChat from './components/HistoryChat';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchToolbar from '../../components/SearchToolbar/SearchToolbar';
import SectionHeader from '../../components/SectionHeader';
import useGiros from './hooks/useGiros';
import useGlobalFilters from '../../hooks/useGlobalFilters';
import useUserAccess from '../../hooks/useUserAccess';

function GirosIndex() {
    const { t } = useTranslation('userForm');
    const navigate = useNavigate();
    const access = useUserAccess();
    const { isMobile, isTablet } = useIsMobile();

    const {
        filters,
        setFilters,
        handleSubmitSearch,
        debounceSearch,
        clearFilters,
        ...filterProps
    } = useGlobalFilters();

    const {
        selected,
        openMenu,
        anchorEl,
        handleCloseMenu,
        handleClickAction,
        handleActionMenu,
        handleCloseCard,
        openCard,
        handleSelectRow,
        selectedItemFromAction,
        shipParametrics,
        loadingGirosData,
        dataGiros,
        fetchinGirosData,
        ...props
    } = useGiros({ filters });

    const getConversationStateIcon = (idState: number) => {
        const iconState: { [key: number]: any } = {
            1: <InfoOutlinedIcon />,
            2: <InfoIcon sx={{ color: '#3761ED' }} />,
            3: <CancelIcon sx={{ color: '#D40000' }} />,
            4: <InfoIcon sx={{ color: '#37BBED' }} />,
            5: <CheckCircleIcon sx={{ color: '#118C29' }} />,
            6: <CancelIcon sx={{ color: '#D40000' }} />,
            7: <CancelIcon sx={{ color: '#D40000' }} />,
            8: <InfoIcon sx={{ color: '#37BBED' }} />,
            9: <CancelIcon sx={{ color: '#D40000' }} />
        };
        return iconState[idState] || iconState[1];
    };

    return (
        <>
            <SectionHeader>
                <SectionHeader.Title>{t('giros.title')}</SectionHeader.Title>
                {!!access?.[2]?.[21] && (
                    <SectionHeader.IconHeader
                        text={t('giros.button')}
                        onClick={() => navigate('solicitud-de-atraque')}
                    />
                )}
            </SectionHeader>

            <Grid
                container
                direction={isMobile ? 'column-reverse' : 'row'}
                justifyContent="center"
                alignItems="center"
                spacing={3}
                mb={2}
                sx={{
                    '& .MuiGrid-root': {
                        width: '100%'
                    }
                }}
            >
                <Grid item xs={12}>
                    <SearchToolbar
                        onChange={debounceSearch}
                        inputSearchName="idGiro"
                        label="ID de giro"
                        onClick={handleSubmitSearch}
                        clearFilters={clearFilters}
                        type="number"
                    >
                        <GirosFilters
                            {...props}
                            {...filterProps}
                            shipParametrics={shipParametrics}
                        />
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
                {openCard && (isMobile || isTablet) ? (
                    ''
                ) : (
                    <Grid item xs={openCard ? 6 : 12} lg={openCard ? 8 : 12}>
                        <DataTable
                            headers={[
                                {
                                    upperLabel: (item: any) => <b>{item?.id}</b>,
                                    width: 3,
                                    noStyle: true
                                },
                                {
                                    upperLabel: (item: any) => item.buque.nombre,
                                    lowerLabel: (item: any) => item.buque.tipoBuque.nombre,
                                    width: 20
                                },
                                {
                                    type: 'element',
                                    width: 3,
                                    align: 'center',
                                    template: (item: any) => {
                                        return getDockingObservedIcons(item?.estado);
                                    }
                                },
                                {
                                    type: 'element',
                                    width: 3,
                                    align: 'center',
                                    template: (item: any) => {
                                        return (
                                            <>
                                                {item?.hasOwnProperty('idRenovacion') &&
                                                    getDockingRenewalIcon(item?.idRenovacion)}
                                            </>
                                        );
                                    }
                                },
                                {
                                    width: 45,
                                    noStyle: true,
                                    upperLabel: (item: any) => {
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {getConversationStateIcon(
                                                    item.idEstadoConversacion
                                                )}
                                                &nbsp;
                                                <strong>
                                                    <span>{item.estadoConversacion}</span>
                                                </strong>
                                            </div>
                                        );
                                    },
                                    lowerLabel: (item: any) => (
                                        <>
                                            Estado: <b>{item?.estado?.toUpperCase()}</b>
                                        </>
                                    )
                                },
                                {
                                    noStyle: true,
                                    width: 15,
                                    align: 'right',
                                    upperLabel: (item: any) => getDateTime(item.fechaCarga)
                                },
                                {
                                    type: 'action',
                                    onClick: handleClickAction
                                }
                            ]}
                            onSelectRow={(item: any) => {
                                if (!!access?.[2]?.[23]) handleSelectRow(item);
                            }}
                            isLoading={loadingGirosData}
                            items={dataGiros}
                            filters={filters}
                            setFilters={setFilters}
                            isFetching={fetchinGirosData}
                            selected={selected}
                        />
                    </Grid>
                )}
                {openCard && (
                    <Grid
                        item
                        xs={!isMobile && !isTablet ? 6 : 12}
                        lg={!isMobile && !isTablet ? 4 : 12}
                    >
                        <HistoryChat
                            onClose={() => handleCloseCard()}
                            selected={selected}
                            access={access}
                            {...props}
                        />
                    </Grid>
                )}
            </Grid>
            <Menu id="basic-menu" anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
                {!!access?.[2]?.[32] && selectedItemFromAction?.estado === 'operando' && (
                    <MenuItem
                        onClick={() =>
                            navigate(`/agp/giros/${selectedItemFromAction?.id}/detalle/renovacion`)
                        }
                    >
                        Renovar
                    </MenuItem>
                )}
                {!!access?.[2]?.[22] && (
                    <MenuItem
                        onClick={() => navigate(`/agp/giros/${selectedItemFromAction?.id}/detalle`)}
                    >
                        Detalle de giro
                    </MenuItem>
                )}
                <MenuItem onClick={() => handleActionMenu('history')}>
                    Historial de conversación
                </MenuItem>
            </Menu>
        </>
    );
}

export default GirosIndex;
