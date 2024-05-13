import { getPatentIconState } from '../../../utils/functions';
import { Grid, Tooltip } from '@mui/material';
import { QUARTER_PERIOD_FULL } from '../../../commons/States';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/DataTable/DataTable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import Filters from './components/Filters';
import GavelIcon from '@mui/icons-material/Gavel';
import SearchToolbar from '../../../components/SearchToolbar/SearchToolbar';
import SectionHeader from '../../../components/SectionHeader';
import useGlobalFilters from '../../../hooks/useGlobalFilters';
import usePatentPasavante from './hooks/usePatentPasavante';

function PatentsPasavanteIndex() {
    const { isMobile } = useIsMobile();
    const navigate = useNavigate();
    const { debounceSearch, filters, setFilters } = useGlobalFilters({
        skip: 0,
        take: 10,
        defaultFiltersFor: 'pasavante'
    });
    const { patents, loadingPatents, fetchingPatents } = usePatentPasavante({ filters });

    return (
        <>
            <SectionHeader>
                <SectionHeader.Title>Gestión de Pasavantes de Patentes</SectionHeader.Title>
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
                        <Filters filters={filters} setFilters={setFilters} />
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
                                    return getPatentIconState(item?.estado);
                                }
                            },
                            {
                                upperLabel: (item: any) => item?.buque?.nombre,
                                lowerLabel: (item: any) => item.buque.tipoBuque.nombre
                            },
                            false && {
                                type: 'element',
                                width: 3,
                                align: 'center',
                                template: (item: any) =>
                                    item?.judicializado && (
                                        <Tooltip title="Judicializado">
                                            <GavelIcon
                                                sx={{
                                                    fontSize: '20px',
                                                    color: '#6837ED'
                                                }}
                                            />
                                        </Tooltip>
                                    )
                            },
                            {
                                type: 'element',
                                width: 3,
                                align: 'center',
                                template: (item: any) =>
                                    item?.fechaBaja && (
                                        <Tooltip title="Solicitud de baja">
                                            <EventBusyIcon
                                                sx={{
                                                    color: '#D40000'
                                                }}
                                            />
                                        </Tooltip>
                                    )
                            },
                            {
                                width: 40,
                                upperLabel: (item: any) => item.agencia?.nombre
                            },
                            {
                                titles: ['Trimestre', 'Año'],
                                upperLabel: (item: any) => (
                                    <b>{QUARTER_PERIOD_FULL[item?.ultimoPeriodo?.trimestre]}</b>
                                ),
                                lowerLabel: (item: any) => <b>{item?.ultimoPeriodo?.anio}</b>,
                                width: 15
                            }
                        ]}
                        onSelectRow={(item: any) => navigate(`${item?.id}/detalle`)}
                        filters={filters}
                        setFilters={setFilters}
                        items={patents || []}
                        isLoading={loadingPatents}
                        isFetching={fetchingPatents}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default PatentsPasavanteIndex;
