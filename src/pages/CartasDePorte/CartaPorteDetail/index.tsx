import _ from 'lodash';
import { Box, Divider, Grid } from '@mui/material';
import { useIsMobile } from '../../../hooks/useIsMobile';
import Button from '../../../components/button/Button';
import CardContainer from './components/CardContainer';
import CardPlaces from './components/CardPlaces';
import DownloadIcon from '@mui/icons-material/Download';
import Loading from '../../../components/Loading';
import SectionHeader from '../../../components/SectionHeader';
import useCartaPorteDetail from './hooks/useCartaPorteDetail';
import WagonDetailCard from './components/WagonDetailCard';
import WagonTable from './components/WagonTable';

function CartaPorteDetail() {
    const { isMobile, isTablet } = useIsMobile();
    const {
        data,
        selected,
        loadingWaybill,
        fetchingWaybill,
        openCard,
        downloadFile,
        downloadingWaybillFile,
        handleCloseCard,
        userCompany,
        confirmAction,
        ...props
    } = useCartaPorteDetail();

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>Información de Carta de Porte</SectionHeader.Title>
            </SectionHeader>

            <Grid
                container
                spacing={2}
                columnSpacing={6}
                sx={{
                    '& .card-container': {
                        border: '2px solid #005093',
                        borderRadius: '10px'
                    }
                }}
            >
                {loadingWaybill || fetchingWaybill ? (
                    <Box m={4} className="flex-center">
                        <Loading size="small" />
                    </Box>
                ) : (
                    !_.isEmpty(data) && (
                        <>
                            <Grid
                                item
                                xs={12}
                                mb={2}
                                display="flex"
                                textAlign="right"
                                justifyContent="flex-end"
                                sx={{ fontSize: '17px' }}
                            >
                                <Grid
                                    container
                                    sx={{
                                        '& .MuiGrid-item': {
                                            gap: '24px',
                                            display: 'flex',
                                            justifyContent: 'flex-end'
                                        },
                                        '& .MuiGrid-item:first-of-type': {
                                            fontWeight: 800
                                        },
                                        '& .MuiGrid-item span:nth-of-type(2)': {
                                            fontWeight: 800
                                        }
                                    }}
                                >
                                    <Grid item xs={12}>
                                        ID N°: {data?.id}
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        mt={2}
                                        sx={{
                                            '& button': {
                                                textTransform: 'uppercase',
                                                background: 'var(--white)'
                                            }
                                        }}
                                    >
                                        <Button
                                            type="outlined"
                                            startIcon={<DownloadIcon />}
                                            onClick={() => downloadFile(data?.id)}
                                            loading={downloadingWaybillFile}
                                        >
                                            Descargar pdf
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <CardPlaces
                                    data={data}
                                    loadingWaybill={loadingWaybill}
                                    fetchingWaybill={fetchingWaybill}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Grid
                                    container
                                    spacing={2}
                                    sx={{ '& .MuiCardContent-root': { padding: 1 } }}
                                >
                                    <Grid item xs={12}>
                                        <CardContainer title="cliente" data={data} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CardContainer title="cargador" data={data} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CardContainer title="consignatario" data={data} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} mt={2}>
                                <Divider
                                    sx={{
                                        border: '1px solid #005093',
                                        width: '95%',
                                        margin: '0 auto'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} mb={2}>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="flex-start"
                                    spacing={3}
                                >
                                    {openCard && (isMobile || isTablet) ? null : (
                                        <Grid
                                            item
                                            xs={openCard ? 6 : 12}
                                            lg={openCard ? 8 : 12}
                                            mt={2}
                                            mb={2}
                                        >
                                            <WagonTable
                                                {...props}
                                                data={data}
                                                selected={selected}
                                                userCompany={userCompany}
                                            />
                                        </Grid>
                                    )}
                                    {openCard && (
                                        <Grid
                                            item
                                            mt={2}
                                            mb={2}
                                            xs={!isMobile && !isTablet ? 6 : 12}
                                            lg={!isMobile && !isTablet ? 4 : 12}
                                        >
                                            <WagonDetailCard
                                                onClose={handleCloseCard}
                                                selected={selected}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        </>
                    )
                )}

                {userCompany?.id === 1 && !_.isEmpty(data) && (
                    <Grid item xs={12} className="flex-center">
                        <Button
                            type="outlined"
                            onClick={() => confirmAction('mover')}
                            disabled={!props?.wagonsToChangeState?.length}
                        >
                            MOVER INTERNAMENTE
                        </Button>
                    </Grid>
                )}
            </Grid>
        </>
    );
}

export default CartaPorteDetail;
