import _ from 'lodash';
import { Box, Drawer, TextareaAutosize } from '@mui/material';
import { useIsMobile } from '../../../hooks/useIsMobile';
import ButtonActions from '../../ButtonActions';
import CloseButton from '../../CloseButton';
import SectionHeader from '../../SectionHeader';

function NotesDrawer(props: any) {
    const { open, handleClose, responseId, handleSetNote, handleSubmit, postingAnswer } = props;
    const { isMobile } = useIsMobile();
    return (
        <>
            <div>
                <Drawer anchor="right" open={open} onClose={handleClose}>
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
                        <CloseButton position="right" onClose={handleClose} />
                        <Box
                            component="div"
                            onSubmit={(e: any) => {
                                e.preventDefault();
                            }}
                            sx={{ padding: '10px', gap: '10px', display: 'grid' }}
                        >
                            <SectionHeader>
                                <SectionHeader.DrawerTitle>
                                    {[3, 9].includes(responseId)
                                        ? 'Denegación de giro'
                                        : 'Nota de conversación'}
                                </SectionHeader.DrawerTitle>
                            </SectionHeader>
                            <TextareaAutosize
                                minRows={5}
                                maxRows={10}
                                name="nota"
                                style={{
                                    marginTop: '24px',
                                    color: 'black',
                                    padding: '10px',
                                    fontSize: '16px'
                                }}
                                onChange={handleSetNote}
                            />
                        </Box>
                        <Box sx={{ margin: '40px 0' }}>
                            <ButtonActions
                                confirmText="Confirmar"
                                renderBackAction
                                returnText="Cancelar"
                                handleClose={handleClose}
                                flexDirection="column-reverse"
                                onClick={handleSubmit}
                                loading={postingAnswer}
                            />
                        </Box>
                    </Box>
                </Drawer>
            </div>
        </>
    );
}

export default NotesDrawer;
