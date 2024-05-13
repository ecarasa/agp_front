import { Alert, Box, Grid } from '@mui/material';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../button/Button';
import DownloadIcon from '@mui/icons-material/Download';
import GavelIcon from '@mui/icons-material/Gavel';
import OperationsLogDrawer from './components/OperationsLogDrawer';
import PatentInformationContainer from './components/PatentInformation/PatentInformationContainer';
import PatentNotesDrawer from './components/PatentNotesDrawer';
import SectionHeader from '../SectionHeader';
import ShipInformationContainer from './components/ShipInformation/ShipInformationContainer';
import styles from './patentstyles.module.css';
import useOperationsLog from './hooks/useOperationsLog';
import usePatentDetail from './hooks/usePatentDetail';

function PatentDetailContainer() {
    const location = useLocation();
    const isNavi = location?.pathname?.includes('navi');
    const { isMobile } = useIsMobile();
    const { t } = useTranslation('userForm');
    const { ...operationsProps } = useOperationsLog();
    const { data, responseId, handleDownloadFile, downloadingPatentFile, ...props } =
        usePatentDetail();

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>
                    Detalle de Patente
                    {isNavi ? ' (Operaciones)' : ''}
                </SectionHeader.Title>
            </SectionHeader>

            <Box
                sx={{
                    fontSize: '18px',
                    padding: { sm: 0, md: '0 65px' }
                }}
                justifyContent="flex-end"
            >
                <Grid container spacing={2}>
                    <Grid
                        item
                        xs={12}
                        // sm={4}
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
                                    onClick={handleDownloadFile}
                                    loading={downloadingPatentFile}
                                >
                                    Descargar pdf
                                </Button>
                            </Grid>
                            {/* )} */}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ fontSize: '17px' }}>
                        <Grid
                            container
                            mt={4}
                            columnSpacing={6}
                            sx={{
                                '& .card-ship-operations': {
                                    border: '2px solid #005093',
                                    borderRadius: '10px'
                                }
                            }}
                        >
                            {data?.judicializado && (
                                <Grid item xs={12} mb={4}>
                                    <Alert
                                        className={styles['header-alert']}
                                        variant="filled"
                                        icon={<GavelIcon />}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <p>Judicializado</p>
                                        </Box>
                                    </Alert>
                                </Grid>
                            )}

                            {/* <RenewalAlert {...props} /> */}

                            <Grid item xs={12} md={6}>
                                <ShipInformationContainer data={data} {...props} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <PatentInformationContainer
                                    data={data}
                                    isNavi={isNavi}
                                    {...props}
                                    {...operationsProps}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/*  Drawer para registrar notas en las respuestas de conversaciones */}
                <PatentNotesDrawer responseId={responseId} {...props} />

                {/*  Drawer para registrar movimientos en cada muelle */}
                <OperationsLogDrawer {...operationsProps} isNavi={isNavi} />

                {/* <EditGeneralInfoDrawer {...props} />
               <BillingNotesDrawer {...props} handleShowNote={handleShowNote} />  */}
            </Box>
        </>
    );
}

export default PatentDetailContainer;
