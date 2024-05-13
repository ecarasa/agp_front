import { Box, Grid, Stack } from '@mui/material';
import { SHIP_STATES } from '../../commons/States';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ActionsMenu from './components/ActionsMenu';
import CancelIcon from '@mui/icons-material/Cancel';
import CertificatesInfoCard from './components/CerticatesCard/CertificatesInfoCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChipsManager from './components/ChipsManager';
import DataTable from '../../components/DataTable/DataTable';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import Loading from '../../components/Loading';
import RejectShipNoteDrawer from './components/RejectShipNoteDrawer';
import SearchToolbar from '../../components/SearchToolbar/SearchToolbar';
import SectionHeader from '../../components/SectionHeader';
import ShipFilters from './components/ShipFilters';
import ShipsInformation from './components/ShipsInformation';
import useFilters from './hooks/useFilters';
import useShips from './hooks/useShips';
import useUserAccess from '../../hooks/useUserAccess';

export const stateIcons = (state: string) => {
    const shipStates: any = {
        BO: <CheckCircleIcon sx={{ color: '#898383' }} fontSize="small" />,
        PE: <CheckCircleIcon sx={{ color: '#898383' }} fontSize="small" />,
        AP: <CheckCircleIcon sx={{ color: '#6EBE64' }} fontSize="small" />,
        RE: <CancelIcon sx={{ color: '#D40000' }} fontSize="small" />,
        SB: <DoDisturbOnIcon sx={{ color: '#898383' }} fontSize="small" />,
        VE: <CancelIcon sx={{ color: '#ff4000' }} fontSize="small" />
    };
    return shipStates[state];
};

function BuquesIndex() {
    const { isMobile, isTablet } = useIsMobile();
    const { t } = useTranslation('userForm');
    const navigate = useNavigate();
    const access = useUserAccess();

    const {
        extraFilters,
        filters,
        setFilters,
        debounceSearch,
        debounceExtraFilters,
        clearExtraFilters,
        handleChangeExtraFilters,
        handleAdvancedSearch,
        ...filterProps
    } = useFilters();

    const {
        shipFullData,
        fetchingShipById,
        handleRejectShip,
        handleManageMenu,
        openCertificatesCard,
        setOpenCertificatesCard,
        openCard,
        setOpenCard,
        openRejectModal,
        setOpenRejectModal,
        shipsData,
        loadingShipData,
        fetchingShipData,
        itemSelected,
        anchorEl,
        menuOpen,
        setMenuOpen,
        setAnchorEl,
        setItemSelected,
        handleCloseMenu,
        selected,
        setSelected,
        setIsLoading,
        handleSelectRow,
        handleOpenCard,
        handleClickAction,
        handleCloseShipInfo,
        ...props
    } = useShips({ filters });

    return (
        <>
            <SectionHeader>
                <SectionHeader.Title>Gestión de Buques</SectionHeader.Title>
                {!!access?.[1]?.[2] && (
                    <SectionHeader.IconHeader
                        onClick={() => navigate('alta-de-buque')}
                        text={t('consultaBuques.button')}
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
                        label="Nombre de barco"
                        inputSearchName="nombreBarco"
                        onClick={handleAdvancedSearch}
                        clearFilters={clearExtraFilters}
                    >
                        <ShipFilters
                            extraFilters={extraFilters}
                            handleChangeExtraFilters={handleChangeExtraFilters}
                            handleAdvancedSearch={handleAdvancedSearch}
                            {...props}
                            {...filterProps}
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
                {(openCard || openCertificatesCard) && (isMobile || isTablet) ? (
                    ''
                ) : (
                    <Grid
                        item
                        xs={openCard || openCertificatesCard ? 6 : 12}
                        lg={openCard || openCertificatesCard ? 8 : 12}
                    >
                        {loadingShipData ? (
                            <Loading />
                        ) : (
                            <DataTable
                                headers={[
                                    {
                                        upperLabel: 'nombre',
                                        lowerLabel: (item: any) => item.tipoBuque.nombre
                                    },
                                    !isMobile && {
                                        type: 'element',
                                        width: 35,
                                        template: (item: any) => {
                                            return (
                                                <Stack
                                                    sx={{ maxHeight: '68px', padding: '1px' }}
                                                    alignItems="flex-start"
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'grid',
                                                            gridTemplateColumns: 'repeat(6, 1fr)'
                                                        }}
                                                    >
                                                        <ChipsManager
                                                            parametricData={props?.parametricData}
                                                            items={item.certificados}
                                                        />
                                                    </Box>
                                                </Stack>
                                            );
                                        }
                                    },
                                    {
                                        titles: ['IMO'],
                                        upperLabel: 'imo',
                                        lowerLabel: (item: any) => item.pais.nombre,
                                        width: 15
                                    },
                                    {
                                        type: 'element',
                                        template: (item: any) => {
                                            return (
                                                <div className="flex-center">
                                                    {stateIcons(item.estado)}&nbsp;
                                                    {SHIP_STATES[item.estado]}
                                                </div>
                                            );
                                        }
                                    },
                                    {
                                        width: 5,
                                        type: 'action',
                                        onClick: handleClickAction
                                    }
                                ]}
                                onSelectRow={(item: any) => {
                                    if (!!access?.[1]?.[16]) handleSelectRow(item);
                                }}
                                isLoading={loadingShipData}
                                isFetching={fetchingShipData}
                                filters={filters}
                                setFilters={setFilters}
                                items={shipsData}
                                selected={selected}
                            />
                        )}
                    </Grid>
                )}
                {openCard && (
                    <Grid
                        item
                        xs={!isMobile && !isTablet ? 6 : 12}
                        lg={!isMobile && !isTablet ? 4 : 12}
                    >
                        <ShipsInformation
                            selected={selected}
                            onClose={handleCloseShipInfo}
                            shipFullData={shipFullData}
                            fetchingShipById={fetchingShipById}
                            setAbrirCard={setOpenCard}
                            handleManageMenu={handleManageMenu}
                            {...props}
                        />
                    </Grid>
                )}
                {openCertificatesCard && (
                    <Grid
                        item
                        xs={!isMobile && !isTablet ? 6 : 12}
                        lg={!isMobile && !isTablet ? 4 : 12}
                    >
                        <CertificatesInfoCard
                            shipFullData={shipFullData}
                            fetchingShipById={fetchingShipById}
                            setOpenCertificatesCard={setOpenCertificatesCard}
                            setAbrirCard={setOpenCard}
                            setItemSelected={setItemSelected}
                            access={access}
                            {...props}
                        />
                    </Grid>
                )}
            </Grid>
            <RejectShipNoteDrawer
                handleRejectShip={handleRejectShip}
                shipFullData={shipFullData}
                openRejectModal={openRejectModal}
                setOpenRejectModal={setOpenRejectModal}
                handleManageMenu={handleManageMenu}
            />
            <ActionsMenu
                anchorEl={anchorEl}
                menuOpen={menuOpen}
                handleCloseMenu={handleCloseMenu}
                itemSelected={itemSelected}
                handleManageMenu={handleManageMenu}
                access={access}
                handleOpenCard={handleOpenCard}
                setSelected={setSelected}
            />
        </>
    );
}

export default BuquesIndex;
