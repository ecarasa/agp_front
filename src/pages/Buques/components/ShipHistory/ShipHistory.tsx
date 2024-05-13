import { getDateTime } from '../../../../utils/common';
import { Grid } from '@mui/material';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import DataTable from '../../../../components/DataTable/DataTable';
import Loading from '../../../../components/Loading';
import SearchToolbar from '../../../../components/SearchToolbar/SearchToolbar';
import SectionHeader from '../../../../components/SectionHeader';
import ShipHistoryFilters from './components/ShipHistoryFilters';
import ShipsInformation from '../ShipsInformation';
import useGlobalFilters from '../../../../hooks/useGlobalFilters';
import useShipHistory from './hooks/useShipHistory';

function ShipHistory() {
    const {
        filters,
        setFilters,
        debounceSearch,
        handleSubmitSearch,
        clearFilters,
        ...filterProps
    } = useGlobalFilters();
    const {
        shipData,
        shipHistoryData,
        getModifiedData,
        handleSelectRow,
        handleCloseCard,
        loadingShipData,
        loadingShipHipstoryData,
        fetchingShipData,
        selected,
        openCard,
        countries
    } = useShipHistory({
        filters
    });
    const { isMobile, isTablet } = useIsMobile();

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>Consulta Histórica de Buque</SectionHeader.Title>
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
                <Grid
                    item
                    xs={12}
                    sx={{
                        fontSize: '20px',
                        '& span': {
                            display: 'inline-flex'
                        }
                    }}
                >
                    <span>
                        Buque:{' '}
                        {loadingShipData ? (
                            <Loading size="extrasmall" />
                        ) : (
                            shipData?.data?.nombre || 'N/A'
                        )}
                    </span>
                </Grid>
                <Grid item xs={12}>
                    <SearchToolbar
                        onChange={debounceSearch}
                        label="Dato modificado"
                        inputSearchName="datoModificado"
                        onClick={handleSubmitSearch}
                        clearFilters={clearFilters}
                    >
                        <ShipHistoryFilters {...filterProps} />
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
                    <Grid item xs={openCard ? 8 : 12}>
                        {loadingShipHipstoryData ? (
                            <Loading />
                        ) : (
                            <DataTable
                                headers={[
                                    {
                                        titles: ['Fecha de modificación'],
                                        upperLabel: (item: any) => (
                                            <b>{getDateTime(item?.fechaModificacion)}</b>
                                        ),
                                        lowerLabel: (item: any) =>
                                            getModifiedData(item?.datosModificados)
                                    }
                                ]}
                                onSelectRow={(item: any) => handleSelectRow(item)}
                                filters={filters}
                                setFilters={setFilters}
                                items={shipHistoryData}
                                loading={fetchingShipData || loadingShipHipstoryData}
                                selected={selected}
                            />
                        )}
                    </Grid>
                )}
                {openCard && (
                    <Grid item xs={!isMobile && !isTablet ? 4 : 12}>
                        <ShipsInformation
                            onClose={handleCloseCard}
                            shipFullData={selected?.datosBuque}
                            setShipFullData={() => {
                                return;
                            }}
                            fetchingShipById={false}
                            handleManageMenu={() => {
                                return;
                            }}
                            countries={countries}
                            hideCertificates
                        />
                    </Grid>
                )}
            </Grid>
        </>
    );
}

export default ShipHistory;
