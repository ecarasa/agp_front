import { getDateTime } from '../../../utils/common';
import { Grid } from '@mui/material';
import { requestServiceState } from '../../../utils/functions';
import { Tooltip } from '@mui/material';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import ActionsMenu from './components/ActionsMenu';
import BackdropComponent from '../../../components/Backdrop/BackdropComponent';
import DataTable from '../../../components/DataTable/DataTable';
import DirectionsBoatFilledIcon from '@mui/icons-material/DirectionsBoatFilled';
import GestionFilters from './components/GestionFilters';
import SearchToolbar from '../../../components/SearchToolbar/SearchToolbar';
import SectionHeader from '../../../components/SectionHeader';
import ServiceInfoCard from './components/ServiceInfoCard';
import useGestionServicios from './hooks/useGestionServicios';
import useGlobalFilters from '../../../hooks/useGlobalFilters';
import useUserAccess from '../../../hooks/useUserAccess';

function GestionSolicitudesIndex() {
    const { isMobile, isTablet } = useIsMobile();
    const access = useUserAccess();

    const {
        filters,
        setFilters,
        debounceSearch,
        handleSubmitSearch,
        clearFilters,
        ...filterProps
    } = useGlobalFilters();

    const {
        openCard,
        handleSelectRow,
        handleClickAction,
        selected,
        requests,
        loadingRequests,
        fetchingRequests,
        loadingLogAttributes,
        cancelingRequest,
        ...props
    } = useGestionServicios({
        filters
    });

    const navigate = useNavigate();

    return (
        <>
            <SectionHeader>
                <SectionHeader.Title>Gestión de Servicios a la Nave</SectionHeader.Title>
                {!!access?.[3]?.[74] && (
                    <SectionHeader.IconHeader
                        text="Nueva Solicitud"
                        onClick={() => navigate('alta-de-solicitud')}
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
                        label="Nombre de buque"
                        inputSearchName="nombreBuque"
                        onClick={handleSubmitSearch}
                        clearFilters={clearFilters}
                    >
                        <GestionFilters {...filterProps} {...props} />
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
                                    upperLabel: (item: any) => item?.buque?.nombre,
                                    lowerLabel: (item: any) => <b>{item?.servicio?.nombre}</b>
                                },
                                {
                                    type: 'element',
                                    width: 25,
                                    align: 'center',
                                    template: (item: any) => <>{requestServiceState(item)}</>
                                },
                                {
                                    type: 'element',
                                    width: 10,
                                    align: 'center',
                                    template: (item: any) =>
                                        item?.giro?.estado === 'operando' && (
                                            <Tooltip title="Operando" placement="right">
                                                <DirectionsBoatFilledIcon
                                                    sx={{
                                                        color: '#6EBE64'
                                                    }}
                                                />
                                            </Tooltip>
                                        )
                                },
                                {
                                    width: 20,
                                    align: 'center',
                                    titles: ['Fecha', 'Solicitante'],
                                    upperLabel: (item: any) => (
                                        <b>{getDateTime(item?.fecha) || 'N/A'}</b>
                                    ),
                                    lowerLabel: (item: any) => (
                                        <b>{item?.agenciaMaritima?.nombre}</b>
                                    )
                                },
                                {
                                    width: 5,
                                    type: 'action',
                                    onClick: handleClickAction
                                }
                            ]}
                            onSelectRow={(item: any) => {
                                if (!!access?.[3]?.[72]) handleSelectRow(item);
                            }}
                            isLoading={loadingRequests}
                            items={requests || []}
                            filters={filters}
                            setFilters={setFilters}
                            isFetching={fetchingRequests}
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
                        <ServiceInfoCard {...props} access={access} />
                    </Grid>
                )}
                <BackdropComponent loading={loadingLogAttributes || cancelingRequest} />
                <ActionsMenu {...props} access={access} />
            </Grid>
        </>
    );
}

export default GestionSolicitudesIndex;
