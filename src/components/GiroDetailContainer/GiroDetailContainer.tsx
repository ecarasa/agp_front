import _ from 'lodash';
import { Alert, Box, Grid } from '@mui/material';
import { getDateTime } from '../../utils/common';
import { getDockingObservedIcons } from '../../utils/functions';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useTranslation } from 'react-i18next';
import BillingNotesDrawer from './BillingNotesDrawer';
import Button from '../button/Button';
import DockingAlertContainer from './DockingAlertContainer';
import DownloadIcon from '@mui/icons-material/Download';
import EditGeneralInfoDrawer from './TripInformation/EditGeneralInfoDrawer';
import MovementsContainer from './Movements/MovementsContainer';
import NotesDrawer from './Movements/NotesDrawer';
import OperationsContainer from './Operations/OperationsContainer';
import RenewalAlert from './RenewalAlert';
import SectionHeader from '../SectionHeader';
import useEditDocking from './hooks/useEditDocking';
import useGiroDetail from './useGiroDetail';
import BlockcahinValidator from '../BlockchainValidator';

const BG_COLOR: { [key: string]: string } = {
    revision: '#029646',
    modificando: '#6837ED'
};

function GiroDetailContainer({ isNavi, isRenewal }: any) {
    const { t } = useTranslation('userForm');
    const { isMobile } = useIsMobile();
    const { responseId, handleDownloadFile, handleShowNote, ...props } = useGiroDetail();
    const { ...editionProps } = useEditDocking({ data: props?.giroData || null });

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>
                    {t('dockingDetail.title')}
                    {isNavi ? ' (Operaciones)' : ''}
                </SectionHeader.Title>
            </SectionHeader>

            <Box
                sx={{
                    fontSize: '18px',
                    padding: { sm: 0, md: '0 65px' },
                    marginTop: isMobile ? 5 : 0
                }}
                justifyContent="flex-end"
            >
                <Grid container spacing={2}>
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: isMobile ? 'column-reverse' : 'row'
                        }}
                    >
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            sx={{
                                fontSize: '17px',
                                display: 'flex',
                                justifyItems: 'center',
                                alignItems: 'center',
                                flexDirection: isMobile ? 'column' : 'row'
                            }}
                        >
                            <BlockcahinValidator data={props?.giroData} />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
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
                                    ID N°: {props?.giroData?.id}
                                </Grid>
                                <Grid item xs={12}>
                                    Fecha ETA:&nbsp;
                                    <b>{getDateTime(props?.giroData?.fechaETA)}</b>
                                </Grid>
                                <Grid item xs={12}>
                                    Fecha ETD:&nbsp;
                                    <b>{getDateTime(props?.giroData?.fechaETD)}</b>
                                </Grid>
                                {props?.giroData && (
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
                                            loading={props?.downloadingFile}
                                        >
                                            Descargar pdf
                                        </Button>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </div>
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
                            {['revision', 'modificando'].includes(props?.giroData?.estado) && (
                                <Grid item xs={12} mb={4}>
                                    <Alert
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '22px',
                                            maxHeight: '60px',
                                            borderRadius: '5px',
                                            background: BG_COLOR[props?.giroData?.estado],
                                            '& .MuiSvgIcon-root': {
                                                color: 'var(--white)',
                                                fontSize: '26px'
                                            }
                                        }}
                                        variant="filled"
                                        icon={getDockingObservedIcons(props?.giroData?.estado)}
                                    >
                                        <DockingAlertContainer
                                            item={props?.giroData || null}
                                            handleShowNote={handleShowNote}
                                        />
                                    </Alert>
                                </Grid>
                            )}

                            <RenewalAlert {...props} />

                            <Grid item xs={12} md={6} mt={4}>
                                <OperationsContainer isNavi={isNavi} {...props} />
                            </Grid>
                            <Grid item xs={12} md={6} mt={4}>
                                <MovementsContainer
                                    isNavi={isNavi}
                                    isRenewal={isRenewal}
                                    {...props}
                                    {...editionProps}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <NotesDrawer open={!!responseId} {...props} responseId={responseId} />
                <EditGeneralInfoDrawer {...props} />
                <BillingNotesDrawer {...props} handleShowNote={handleShowNote} />
            </Box>
        </>
    );
}

export default GiroDetailContainer;
