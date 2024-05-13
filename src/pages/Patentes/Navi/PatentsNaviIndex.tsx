import { Grid, Tooltip } from '@mui/material';
import { QUARTER_PERIOD_FULL } from '../../../commons/States';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/DataTable/DataTable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import GavelIcon from '@mui/icons-material/Gavel';
import PatentFilters from '../components/PatentFilters';
import SearchToolbar from '../../../components/SearchToolbar/SearchToolbar';
import SectionHeader from '../../../components/SectionHeader';
import useGlobalFilters from '../../../hooks/useGlobalFilters';
import usePatentNavi from './hooks/usePatentNavi';
import useUserAccess from '../../../hooks/useUserAccess';

function PatentsNaviIndex() {
    const navigate = useNavigate();
    const access = useUserAccess();
    const { isMobile } = useIsMobile();
    const {
        filters,
        setFilters,
        debounceSearch,
        handleSubmitSearch,
        clearFilters,
        ...filterProps
    } = useGlobalFilters({ skip: 0, take: 10, defaultFiltersFor: 'navi' });
    const { loadingPatents, fetchingPatents, patents } = usePatentNavi({ filters });

    return (
        <>
            <SectionHeader>
                <SectionHeader.Title>Gestión de Operaciones de Patentes</SectionHeader.Title>
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
                        inputSearchName="nombreBuque"
                        label="Nombre de buque"
                        onClick={() => {
                            if (filterProps?.extraFilters) {
                                let auxFilters = { ...filters };
                                delete auxFilters['defaultFiltersFor'];
                                setFilters({
                                    ...auxFilters,
                                    ...filterProps?.extraFilters
                                });
                            }
                        }}
                        clearFilters={clearFilters}
                        disabled={
                            (!!filterProps?.extraFilters?.anio &&
                                !filterProps?.extraFilters?.trimestre) ||
                            (!filterProps?.extraFilters?.anio &&
                                !!filterProps?.extraFilters?.trimestre)
                        }
                    >
                        <PatentFilters {...filterProps} />
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
                                upperLabel: (item: any) => item.buque.nombre,
                                lowerLabel: (item: any) => item.buque.tipoBuque.nombre
                            },
                            {
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
                        onSelectRow={(item: any) => {
                            if (!!access?.[8]?.[47]) navigate(`${item?.id}/detalle`);
                        }}
                        isLoading={loadingPatents}
                        items={patents || []}
                        filters={filters}
                        setFilters={setFilters}
                        isFetching={fetchingPatents}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default PatentsNaviIndex;
