import _ from 'lodash';
import { Box, Drawer, TextareaAutosize } from '@mui/material';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { useTranslation } from 'react-i18next';
import ButtonActions from '../../../../components/ButtonActions';
import CloseButton from '../../../../components/CloseButton';
import SectionHeader from '../../../../components/SectionHeader';

function ReviewNoteDrawer(props: any) {
    const {
        openReviewNoteDrawer,
        handleCloseReviewNoteDrawer,
        setReviewNote,
        reviewNote,
        handleSubmitReview
    } = props;
    const { isMobile } = useIsMobile();
    const { t } = useTranslation('userForm');

    return (
        <Drawer anchor="right" open={openReviewNoteDrawer} onClose={handleCloseReviewNoteDrawer}>
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
                <CloseButton position="right" onClose={handleCloseReviewNoteDrawer} />
                <Box
                    component="div"
                    onSubmit={(e: any) => {
                        e.preventDefault();
                    }}
                    sx={{ padding: '10px', gap: '10px', display: 'grid' }}
                >
                    <SectionHeader>
                        <SectionHeader.DrawerTitle>
                            Enviar nota de revisión
                        </SectionHeader.DrawerTitle>
                    </SectionHeader>
                    <TextareaAutosize
                        minRows={5}
                        maxRows={10}
                        style={{ color: 'black', padding: '10px', fontSize: '16px' }}
                        onChange={(e: any) => {
                            setReviewNote(e.target.value);
                        }}
                        value={reviewNote}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 5, justifyContent: 'center', margin: '15px' }}>
                    <ButtonActions
                        confirmText="Aceptar"
                        disabled={!reviewNote}
                        renderBackAction
                        flexDirection="column-reverse"
                        handleClose={handleCloseReviewNoteDrawer}
                        returnText={t('cancel')}
                        onClick={() => handleSubmitReview()}
                    />
                </Box>
            </Box>
        </Drawer>
    );
}

export default ReviewNoteDrawer;
