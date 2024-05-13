import _ from 'lodash';
import { Box, Grid } from '@mui/material';
import { useIsMobile } from '../../../hooks/useIsMobile';
import ActionDialog from './components/ActionDialog';
import Button from '../../../components/button/Button';
import DataTable from '../../../components/DataTable/DataTable';
import InspectionFilters from './components/InspectionFilters';
import SearchToolbar from '../../../components/SearchToolbar/SearchToolbar';
import SectionHeader from '../../../components/SectionHeader';
import styles from '../../../components/GiroDetailContainer/style.module.css';
import useFilters from './hooks/useFilters';
import useInspection from './hooks/useInspection';
import WagonDetailCard from '../CartaPorteDetail/components/WagonDetailCard';
import WagonStates from '../components/WagonStates';

function InspeccionVagones() {
    const { isMobile, isTablet } = useIsMobile();
    const { filters, setFilters, handleSeachWagon, ...filterProps } = useFilters();
    const {
        data,
        loadingWaybill,
        fetchingWaybill,
        selected,
        openCard,
        filteredData,
        handleSelectRow,
        handleCloseCard,
        clearDialogForm,
        handleAction,
        ...props
    } = useInspection({ filters });

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>Inspección de Vagones</SectionHeader.Title>
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
                        onChange={handleSeachWagon}
                        inputSearchName="search"
                        label="Vagón / Contenedor / Precinto / Color Precinto"
                        hiddeButtons
                        width="420px"
                    >
                        <InspectionFilters
                            {...filterProps}
                            filters={filters}
                            handleSeachWagon={handleSeachWagon}
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
                                    titles: ['Vagón', 'Contenedor'],
                                    upperLabel: (item: any) => <b>{item?.nroVagon}</b>,
                                    lowerLabel: (item: any) => (
                                        <b>{item?.nroContenedor || 'N/A'}</b>
                                    ),
                                    noStyle: true,
                                    width: 45
                                },
                                {
                                    width: 35,
                                    noStyle: true,
                                    upperLabel: (item: any) => {
                                        return (
                                            <div className="flex-align-center">
                                                <WagonStates
                                                    states={{
                                                        estado: item?.estado,
                                                        estadoInspeccion: item?.inspeccion?.estado,
                                                        inspectionTable: true
                                                    }}
                                                />
                                            </div>
                                        );
                                    }
                                },
                                {
                                    width: 20,
                                    titles: ['Precinto', 'Color'],
                                    upperLabel: (item: any) => <b>{item?.nroPrecinto || 'N/A'}</b>,
                                    lowerLabel: (item: any) => <b>{item?.colorPrecinto || 'N/A'}</b>
                                }
                            ]}
                            onSelectRow={(item: any) => {
                                handleSelectRow(item);
                            }}
                            isLoading={loadingWaybill}
                            items={{
                                data: {
                                    data: !_.isEmpty(filters) ? filteredData : data?.vagones
                                }
                            }}
                            filters={filters}
                            setFilters={setFilters}
                            isFetching={fetchingWaybill}
                            selected={selected}
                            noPaginated
                        />
                    </Grid>
                )}
                {openCard && (
                    <Grid
                        item
                        xs={!isMobile && !isTablet ? 6 : 12}
                        lg={!isMobile && !isTablet ? 4 : 12}
                    >
                        <WagonDetailCard
                            onClose={handleCloseCard}
                            selected={selected}
                            loadingWaybill={loadingWaybill}
                            fetchingWaybill={fetchingWaybill}
                        >
                            <Box mt={8} className={styles['grid-button-container']}>
                                {selected?.inspeccion?.estado === 'Observado' && (
                                    <>
                                        <Button onClick={() => handleAction('resolver')}>
                                            RESOLVER
                                        </Button>
                                    </>
                                )}
                                {!selected?.inspeccion?.estado && (
                                    <>
                                        <Button onClick={() => handleAction('aprobar')}>
                                            APROBAR
                                        </Button>
                                        <div className={styles['btn-dng']}>
                                            <Button
                                                type="outlined"
                                                onClick={() => handleAction('observar')}
                                            >
                                                OBSERVAR
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Box>
                        </WagonDetailCard>
                    </Grid>
                )}
            </Grid>
            <ActionDialog {...props} />
        </>
    );
}

export default InspeccionVagones;
