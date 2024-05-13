import { getDateTime } from '../../../utils/common';
import { getDockingIconState, getDockingRenewalIcon } from '../../../utils/functions';
import { Grid } from '@mui/material';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/DataTable/DataTable';
import PasavantesFilters from './components/PasavantesFilters';
import SearchToolbar from '../../../components/SearchToolbar/SearchToolbar';
import SectionHeader from '../../../components/SectionHeader';
import usePasavantes from './hooks/usePasavantes';

function PasavantesIndex() {
    const navigate = useNavigate();
    const { isMobile } = useIsMobile();
    const {
        debounceSearch,
        dataGiros,
        filters,
        setFilters,
        loadingDataGiros,
        fetchinDataGiros,
        anchorEl,
        openMenu,
        handleCloseMenu,
        handleClickAction,
        selectedItemFromAction,
        ...props
    } = usePasavantes();

    return (
        <>
            <SectionHeader>
                <SectionHeader.Title>Gestión de Pasavantes de Giros</SectionHeader.Title>
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
                        inputSearchName="nombreBuque"
                        hiddeButtons
                    >
                        <PasavantesFilters filters={filters} setFilters={setFilters} {...props} />
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
                <Grid item xs={12}>
                    <DataTable
                        headers={[
                            {
                                type: 'element',
                                width: 3,
                                align: 'center',
                                template: (item: any) => {
                                    return getDockingIconState(item?.estado);
                                }
                            },
                            {
                                upperLabel: (item: any) => item?.buque?.nombre,
                                lowerLabel: (item: any) => item.buque.tipoBuque.nombre
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
                                noStyle: true,
                                width: 40,
                                upperLabel: (item: any) => item.agencia?.nombre,
                                lowerLabel: (item: any) => item.tipoTrafico?.nombre
                            },
                            {
                                width: 15,
                                titles: ['E. Van', 'S. Van'],
                                upperLabel: (item: any) => getDateTime(item.fechaEntradaVanguardia),
                                lowerLabel: (item: any) => getDateTime(item.fechaSalidaVanguardia)
                            }
                        ]}
                        onSelectRow={(item: any) => navigate(`${item?.id}/detalle`)}
                        filters={filters}
                        setFilters={setFilters}
                        items={dataGiros || []}
                        isLoading={loadingDataGiros}
                        isFetching={fetchinDataGiros}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default PasavantesIndex;
