import { memo } from 'react';
import _ from 'lodash';
import { Box, Drawer } from '@mui/material';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import ButtonActions from '../../../../../components/ButtonActions';
import CloseButton from '../../../../../components/CloseButton';
import SectionHeader from '../../../../../components/SectionHeader';
import TextareaAutosize from '@mui/base/TextareaAutosize';

function RejectNoteDrawer(props: any) {
    const {
        data,
        setOpen,
        handleRejectCertificate,
        shipFullData,
        handleChangeRejectCertificate,
        setShipFullData
    } = props;
    const { isMobile } = useIsMobile();

    const handleClose = () => {
        if (shipFullData?.rejectCertificateNote) {
            let newObject = _.cloneDeep(shipFullData);
            delete newObject.rejectCertificateNote;
            setShipFullData(newObject);
        }
        setOpen(null);
    };
    return (
        <div>
            <Drawer anchor="right" open={!_.isEmpty(data)} onClose={handleClose}>
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
                                {data?.item?.estado === 'RE'
                                    ? 'Nota de Rechazo'
                                    : 'Rechazo de Certificado'}
                            </SectionHeader.DrawerTitle>
                        </SectionHeader>
                        <TextareaAutosize
                            minRows={5}
                            maxRows={10}
                            readOnly={data?.item?.estado === 'RE'}
                            style={{ color: 'black', padding: '10px', fontSize: '16px' }}
                            onChange={handleChangeRejectCertificate}
                            value={
                                shipFullData?.rejectCertificateNote || data?.rejectCertificateNote
                            }
                        />
                    </Box>
                    <Box sx={{ margin: '40px 0' }}>
                        <ButtonActions
                            confirmText={data?.item?.estado !== 'RE' ? 'Guardar' : 'Cerrar'}
                            renderBackAction={data?.item?.estado !== 'RE'}
                            handleClose={handleClose}
                            returnText="Cerrar"
                            flexDirection="column-reverse"
                            disabled={
                                !shipFullData?.rejectCertificateNote &&
                                !data?.rejectCertificateNote &&
                                data?.item?.estado !== 'RE'
                            }
                            onClick={() => {
                                if (data?.item?.estado === 'RE') handleClose();
                                else handleRejectCertificate(data);
                            }}
                        />
                    </Box>
                </Box>
            </Drawer>
        </div>
    );
}

export default RejectNoteDrawer;
