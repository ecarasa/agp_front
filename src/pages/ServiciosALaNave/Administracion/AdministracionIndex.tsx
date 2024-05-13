import { Grid } from '@mui/material';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import AdministracionFilters from './components/AdministracionFilters';
import DataTable from '../../../components/DataTable/DataTable';
import SectionHeader from '../../../components/SectionHeader';
import StateService from './ServiciosSave/components/StateService';
import useGlobalFilters from '../../../hooks/useGlobalFilters';
import useServicios from './hooks/useServicios';
import useUserAccess from '../../../hooks/useUserAccess';

function AdministracionIndex() {
    const navigate = useNavigate();
    const access = useUserAccess();
    const { isMobile } = useIsMobile();
    const { filters, setFilters } = useGlobalFilters();

    const { servicios, loadingServicios, fetchingServicios } = useServicios({
        filters
    });

    return (
        <>
            <SectionHeader>
                <SectionHeader.Title>Administración de Servicios a la Nave</SectionHeader.Title>
                {!!access?.[3]?.[89] && (
                    <SectionHeader.IconHeader
                        text="Nuevo Servicio"
                        onClick={() => navigate('nuevo-servicio')}
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
                <Grid item xs={12} className="filters-container-toolbar">
                    {!loadingServicios && (
                        <AdministracionFilters filters={filters} setFilters={setFilters} />
                    )}
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
                                upperLabel: (item: any) => item?.nombre
                            },
                            {
                                type: 'element',
                                width: 50,
                                align: 'center',
                                template: (item: any) => <StateService data={item} />
                            }
                        ]}
                        onSelectRow={(item: any) => {
                            if (!!access?.[3]?.[90]) navigate(`${item?.id}/detalle`);
                        }}
                        isLoading={loadingServicios}
                        items={servicios || []}
                        filters={filters}
                        setFilters={setFilters}
                        isFetching={fetchingServicios}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default AdministracionIndex;
