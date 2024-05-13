import { Box, Drawer } from '@mui/material';
import { useIsMobile } from '../../../hooks/useIsMobile';
import CancelIconAgp from '../../../assets/icons/cancelIconAgp.png';
import CheckIconAgp from '../../../assets/icons/checkIconAgp.png';
import ShipsInformation from '../../../pages/Buques/components/ShipsInformation';

function ShipDataDrawer(props: any) {
    const {
        openShipDrawer,
        handleCloseDrawer,
        data,
        countries,
        loadingCountries,
        handleDownloadCertificate
    } = props;
    const { isMobile } = useIsMobile();

    return (
        <Drawer anchor="right" open={openShipDrawer} onClose={handleCloseDrawer}>
            <Box
                sx={{
                    marginTop: '64px',
                    width: isMobile ? '100vw' : 420,
                    height: '100%',
                    '& .MuiFormControl-root': { m: '8px 0', width: '100%' }
                }}
                role="presentation"
            >
                <Box
                    component="div"
                    onSubmit={(e: any) => {
                        e.preventDefault();
                    }}
                    sx={{
                        padding: '10px',
                        gap: '10px',
                        display: 'grid',
                        '& .right-card-information': {
                            maxHeight: '100%'
                        },
                        '& .MuiPaper-root': {
                            border: 'none'
                        },
                        '& .MuiBox-root': {
                            boxShadow: 'none'
                        }
                    }}
                >
                    <ShipsInformation
                        shipFullData={{ ...data?.buque, armador: data?.armadorPrincipal }}
                        callback={handleDownloadCertificate}
                        fetchingShipById={loadingCountries}
                        onClose={handleCloseDrawer}
                        countries={countries}
                        extraData={
                            <>
                                {data?.buque?.estado === 'AP' || data?.buque?.estado === 'SB' ? (
                                    <>
                                        <img
                                            style={{ margin: '0 4px' }}
                                            src={CheckIconAgp}
                                            alt="check"
                                            height={15}
                                        />
                                        Aprobado
                                    </>
                                ) : (
                                    <>
                                        <img
                                            style={{ margin: '0 4px' }}
                                            src={CancelIconAgp}
                                            alt="check"
                                            height={18}
                                        />
                                        No operativo
                                    </>
                                )}
                            </>
                        }
                    />
                </Box>
            </Box>
        </Drawer>
    );
}

export default ShipDataDrawer;
