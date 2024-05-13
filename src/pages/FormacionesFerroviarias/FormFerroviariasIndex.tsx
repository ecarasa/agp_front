import { getDateFilterValidation } from '../../utils/functions';
import { getDateTime } from '../../utils/common';
import { Grid, Tooltip } from '@mui/material';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import BackdropComponent from '../../components/Backdrop/BackdropComponent';
import DataTable from '../../components/DataTable/DataTable';
import DeleteIcon from '@mui/icons-material/Delete';
import Filters from './components/Filters';
import SearchToolbar from '../../components/SearchToolbar/SearchToolbar';
import SectionHeader from '../../components/SectionHeader';
import SideCard from './components/SideCard';
import useFormaciones from './hooks/useFormaciones';
import useGlobalFilters from '../../hooks/useGlobalFilters';
import useUserAccess from '../../hooks/useUserAccess';

function FormacionesFerroviariasIndex() {
    const navigate = useNavigate();
    const access = useUserAccess();
    const { isMobile, isTablet } = useIsMobile();

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
        selected,
        formacionesFerroviarias,
        loadingFormaciones,
        fetchingFormaciones,
        handleSelectRow,
        handleClickAction,
        handleDelete,
        deletingRailway,
        ...props
    } = useFormaciones({
        filters
    });

    return (
        <>
            <SectionHeader>
                <SectionHeader.Title>Gestión de Ferroviarios</SectionHeader.Title>
                <SectionHeader.IconHeader
                    onClick={() => navigate('nueva-formacion')}
                    text="Nueva Formación"
                />
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
                        inputSearchName="nombreFerrocarril"
                        label="Nombre de Ferrocarril"
                        onClick={handleSubmitSearch}
                        clearFilters={clearFilters}
                        disabled={getDateFilterValidation(filterProps)}
                    >
                        <Filters {...filterProps} {...props} />
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
                                    upperLabel: (item: any) => <b>{item?.ferrocarril?.nombre}</b>,
                                    lowerLabel: (item: any) => <b>{item?.nroLocomotora}</b>
                                },
                                {
                                    width: 15,
                                    upperLabel: (item: any) => <b>{item?.parrilla?.nombre}</b>
                                },
                                {
                                    width: 25,
                                    align: 'center',
                                    upperLabel: (item: any) => <b>{getDateTime(item?.fecha)}</b>,
                                    lowerLabel: (item: any) => (
                                        <b>{item?.ingreso ? 'Ingreso' : 'Egreso'}</b>
                                    )
                                },
                                {
                                    type: 'action',
                                    icon: (
                                        <Tooltip title="Eliminar" placement="top-start">
                                            <DeleteIcon />
                                        </Tooltip>
                                    ),
                                    onClick: (e: any, item: any) => handleDelete(item)
                                }
                            ]}
                            onSelectRow={(item: any) => {
                                handleSelectRow(item);
                            }}
                            isLoading={loadingFormaciones}
                            items={formacionesFerroviarias || []}
                            filters={filters}
                            setFilters={setFilters}
                            isFetching={fetchingFormaciones}
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
                        <SideCard {...props} data={selected} />
                    </Grid>
                )}
            </Grid>

            <BackdropComponent loading={deletingRailway} />
        </>
    );
}

export default FormacionesFerroviariasIndex;
