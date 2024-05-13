import _ from 'lodash';
import { Box, Drawer, TextareaAutosize } from '@mui/material';
import { useIsMobile } from '../../../hooks/useIsMobile';
import ButtonActions from '../../../components/ButtonActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseButton from '../../../components/CloseButton';
import PendingIcon from '@mui/icons-material/Pending';
import SectionHeader from '../../../components/SectionHeader';

function ConversationDetailDrawer(props: any) {
    const { open, handleOpenDetailDrawer } = props;
    const { isMobile } = useIsMobile();

    return (
        <>
            <div>
                <Drawer anchor="right" open={!_.isEmpty(open)} onClose={handleOpenDetailDrawer}>
                    <Box
                        sx={{
                            marginTop: '64px',
                            width: isMobile ? '100vw' : 420,
                            height: '100%',
                            padding: '20px',
                            '& .MuiFormControl-root': { m: '8px 0', width: '100%' }
                        }}
                        role="presentation"
                    >
                        <CloseButton position="right" onClose={handleOpenDetailDrawer} />
                        <Box
                            component="div"
                            onSubmit={(e: any) => {
                                e.preventDefault();
                            }}
                            sx={{ padding: '10px', gap: '10px', display: 'grid' }}
                        >
                            <SectionHeader>
                                <SectionHeader.DrawerTitle>
                                    {open?.tipo?.evento} - {open?.tipo?.mensaje}
                                </SectionHeader.DrawerTitle>
                            </SectionHeader>
                            <Box
                                sx={{
                                    justifyContent: 'space-between',
                                    display: 'inline-flex',
                                    margin: '20px 0',
                                    '& div': {
                                        display: 'inherit',
                                        alignItems: 'center',
                                        '& svg': {
                                            marginRight: '5px'
                                        }
                                    }
                                }}
                            >
                                <p>Estado de conversación:</p>
                                <div>
                                    {open?.fechaFinalizacion ? (
                                        <>
                                            <CheckCircleIcon sx={{ color: '#118C29' }} />
                                            Finalizada
                                        </>
                                    ) : (
                                        <>
                                            <PendingIcon color="disabled" /> Pendiente
                                        </>
                                    )}
                                </div>
                            </Box>
                            <TextareaAutosize
                                minRows={5}
                                maxRows={10}
                                value={open?.nota || ''}
                                readOnly
                                style={{ color: 'black', padding: '10px', fontSize: '16px' }}
                            />
                        </Box>
                        <Box sx={{ margin: '40px 0' }}>
                            <ButtonActions
                                confirmText="Cerrar"
                                handleClose={handleOpenDetailDrawer}
                                flexDirection="column-reverse"
                                onClick={handleOpenDetailDrawer}
                            />
                        </Box>
                    </Box>
                </Drawer>
            </div>
        </>
    );
}

export default ConversationDetailDrawer;
