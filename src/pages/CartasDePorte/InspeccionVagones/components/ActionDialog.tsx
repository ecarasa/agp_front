import { Box, FormControl, InputLabel, MenuItem, Select, TextareaAutosize } from '@mui/material';
import Button from '../../../../components/button/Button';
import CloseButton from '../../../../components/CloseButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InfoAlert from '../../../../assets/animations/infoAlert.json';
import Lottie from 'lottie-react';

const title: { [key: string]: string } = {
    aprobar: '¿Desea aprobar este vagón?',
    observar: '¿Desea observar este vagón?',
    resolver: '¿Desea resolver observación de vagón?'
};

export default function ActionDialog({
    openDialog,
    handleCloseDialog,
    extraInfo,
    rejectMotives,
    handleSubmit,
    handleChange,
    updatingWaybillWagon
}: any) {
    return (
        <Dialog open={!!openDialog} onClose={handleCloseDialog}>
            <Box mt={2} mr={2}>
                <CloseButton position="right" onClose={handleCloseDialog} />
            </Box>
            <Lottie style={{ height: 150 }} animationData={InfoAlert} />

            <DialogTitle
                sx={{ fontWeight: 600, fontSize: '26px', padding: '20px 20px 0' }}
                className="flex-center"
            >
                {title[openDialog]}
            </DialogTitle>
            <Box
                component="form"
                onSubmit={(e: any) => {
                    e.preventDefault();
                    handleSubmit(openDialog);
                }}
            >
                <DialogContent>
                    <>
                        {['observar', 'resolver'].includes(openDialog) && (
                            <Box
                                sx={{
                                    padding: '8px 0',
                                    margin: '0 auto',
                                    '& svg': {
                                        display: 'none'
                                    }
                                }}
                            >
                                <FormControl fullWidth variant="outlined" required>
                                    <InputLabel htmlFor="motivoRechazo">
                                        Motivo de rechazo
                                    </InputLabel>
                                    <Select
                                        labelId="motivoRechazo"
                                        label="Tipo de operacion"
                                        name="idMotivoRechazo"
                                        value={extraInfo?.idMotivoRechazo || ''}
                                        onChange={handleChange}
                                        disabled={openDialog === 'resolver'}
                                    >
                                        {rejectMotives?.map((item: any) => (
                                            <MenuItem key={item?.id} value={item.id}>
                                                {item?.descripcion}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        )}
                        <TextareaAutosize
                            required
                            minRows={5}
                            maxRows={5}
                            name="nota"
                            value={extraInfo?.nota}
                            placeholder="Escriba una nota"
                            style={{
                                borderRadius: '16px',
                                color: 'black',
                                padding: '10px',
                                fontSize: '16px',
                                maxHeight: 100
                            }}
                            onChange={handleChange}
                        />
                    </>
                </DialogContent>
                <DialogActions sx={{ width: '100%' }} className="flex-center">
                    <Box
                        sx={{
                            flexDirection: 'column',
                            display: 'flex',
                            gap: '15px',
                            '& button': { minWidth: '120px' }
                        }}
                        mb={2}
                    >
                        <Button loading={updatingWaybillWagon}>Aceptar</Button>
                        <Button type="outlined" onClick={handleCloseDialog}>
                            Cancelar
                        </Button>
                    </Box>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
