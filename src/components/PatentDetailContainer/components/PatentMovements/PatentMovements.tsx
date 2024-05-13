import { getDateTime } from '../../../../utils/common';
import { Grid, Tooltip } from '@mui/material';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import BackdropComponent from '../../../Backdrop/BackdropComponent';
import DataTable from '../../../DataTable/DataTable';
import DeleteIcon from '@mui/icons-material/Delete';
import EditPatentMovementDrawer from './EditionDrawer';
import Loading from '../../../Loading';
import PatentMovementFilters from './Filters';
import SectionHeader from '../../../SectionHeader';
import useGlobalFilters from '../../../../hooks/useGlobalFilters';
import usePatentMovements from './hooks/usePatentMovements';

function PatentMovements() {
    const { isMobile } = useIsMobile();
    const { filters, setFilters } = useGlobalFilters();
    const {
        patentData,
        patentMovements,
        loadingPatentMovements,
        fetchingPatentMovements,
        loadingFilterOptions,
        handleEdit,
        confirmDeleteMovement,
        deletingMovement,
        ...props
    } = usePatentMovements({ filters });

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>
                    Movimientos{' '}
                    {patentData
                        ? `${patentData?.ultimoPeriodo?.trimestre}° Trimestre ${patentData?.ultimoPeriodo?.anio}`
                        : ''}
                </SectionHeader.Title>
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
                    <b>{patentData?.buque?.nombre}</b>
                </Grid>
                <Grid item xs={12} className="filters-container-toolbar">
                    {loadingFilterOptions ? (
                        <Loading size="small" position="flex-start" />
                    ) : (
                        <PatentMovementFilters
                            filters={filters}
                            setFilters={setFilters}
                            {...props}
                        />
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
                                titles: ['Terminal', 'Muelle'],
                                upperLabel: (item: any) => <b>{item?.muelle?.terminal?.nombre}</b>,
                                lowerLabel: (item: any) => <b>{item?.muelle?.nombre}</b>
                            },
                            {
                                width: 25,
                                titles: ['Entrada', 'Salida'],
                                upperLabel: (item: any) => getDateTime(item?.fechaEntrada),
                                lowerLabel: (item: any) => getDateTime(item?.fechaSalida)
                            },
                            {
                                type: 'action',
                                onClick: (e: any, item: any) => confirmDeleteMovement(item),
                                icon: (
                                    <Tooltip title="Eliminar movimiento" placement="top">
                                        <DeleteIcon />
                                    </Tooltip>
                                )
                            }
                        ]}
                        onSelectRow={(item: any) => {
                            handleEdit(item);
                        }}
                        isLoading={loadingPatentMovements}
                        items={patentMovements || []}
                        filters={filters}
                        setFilters={setFilters}
                        isFetching={fetchingPatentMovements}
                    />
                </Grid>
            </Grid>

            <EditPatentMovementDrawer {...props} isMobile={isMobile} />

            <BackdropComponent loading={deletingMovement} />
        </>
    );
}

export default PatentMovements;
