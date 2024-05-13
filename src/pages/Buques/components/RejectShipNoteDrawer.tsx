import _ from 'lodash';
import { Box, Drawer, TextareaAutosize } from '@mui/material';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useTranslation } from 'react-i18next';
import ButtonActions from '../../../components/ButtonActions';
import CloseButton from '../../../components/CloseButton';
import SectionHeader from '../../../components/SectionHeader';

function RejectShipNoteDrawer(props: any) {
    const { openRejectModal, setOpenRejectModal, shipFullData, setShipFullData, handleRejectShip } =
        props;
    const { isMobile } = useIsMobile();
    const { t } = useTranslation('userForm');

    const handleClose = () => {
        if (shipFullData?.rejectNote) {
            let newObject = _.cloneDeep(shipFullData);
            delete newObject.rejectNote;
            setShipFullData(newObject);
        }
        setOpenRejectModal(null);
    };

    return (
        <Drawer anchor="right" open={openRejectModal?.value} onClose={handleClose}>
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
                        <SectionHeader.DrawerTitle>Rechazo de Buque</SectionHeader.DrawerTitle>
                    </SectionHeader>
                    <TextareaAutosize
                        minRows={5}
                        maxRows={10}
                        readOnly={shipFullData?.estado === 'RE'}
                        style={{ color: 'black', padding: '10px', fontSize: '16px' }}
                        onChange={(e: any) => {
                            setShipFullData({
                                ...shipFullData,
                                rejectNote: e.target.value
                            });
                        }}
                        value={shipFullData?.rejectNote || shipFullData?.nota?.nota}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 5, justifyContent: 'center', margin: '15px' }}>
                    <ButtonActions
                        confirmText={shipFullData?.estado === 'RE' ? 'Cerrar' : 'Continuar'}
                        disabled={!shipFullData?.rejectNote && shipFullData?.estado !== 'RE'}
                        renderBackAction={shipFullData?.estado !== 'RE'}
                        flexDirection="column-reverse"
                        handleClose={handleClose}
                        returnText={t('cancel')}
                        onClick={() => {
                            if (shipFullData?.estado === 'RE') handleClose();
                            else handleRejectShip(openRejectModal?.item);
                        }}
                    />
                </Box>
            </Box>
        </Drawer>
    );
}

export default RejectShipNoteDrawer;
