import { getDateTime } from '../../../utils/common';
import { getDockingIconState, getDockingObservedIcons } from '../../../utils/functions';
import { Grid } from '@mui/material';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/DataTable/DataTable';
import NaviFilters from './components/NaviFilters';
import SearchToolbar from '../../../components/SearchToolbar/SearchToolbar';
import SectionHeader from '../../../components/SectionHeader';
import useGlobalFilters from '../../../hooks/useGlobalFilters';
import useNavi from './hooks/useNavi';

const NaviIndex = () => {
    const { isMobile } = useIsMobile();
    const navigate = useNavigate();
    const { debounceSearch, filters, setFilters, ...filterProps } = useGlobalFilters();
    const { dataGiros, fetchinGirosData, loadingGirosData } = useNavi({
        filters: {
            ...filters,
            estadoGiro: filters?.estadoGiro || 'navi'
        }
    });

    return (
        <>
            <SectionHeader>
                <SectionHeader.Title>Gestión de Operaciones de Giros</SectionHeader.Title>
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
                        <NaviFilters filters={filters} setFilters={setFilters} {...filterProps} />
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
                                upperLabel: (item: any) => item.buque.nombre,
                                lowerLabel: (item: any) => item.buque.tipoBuque.nombre
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
                                upperLabel: (item: any) => item.agencia?.nombre,
                                lowerLabel: (item: any) => item.tipoTrafico?.nombre
                            },
                            {
                                width: 25,
                                titles: ['ETA', 'ETD'],
                                upperLabel: (item: any) => getDateTime(item.fechaETA),
                                lowerLabel: (item: any) => getDateTime(item.fechaETD)
                            },
                            {
                                width: 15,
                                titles: ['E. Van', 'S. Van'],
                                upperLabel: (item: any) => getDateTime(item.fechaEntradaVanguardia),
                                lowerLabel: (item: any) => getDateTime(item.fechaSalidaVanguardia)
                            }
                        ]}
                        onSelectRow={(item: any) => navigate(`/agp/giros/navi/${item.id}/detalle`)}
                        filters={filters}
                        setFilters={setFilters}
                        items={dataGiros || []}
                        isLoading={loadingGirosData}
                        isFetching={fetchinGirosData}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default NaviIndex;
