import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useIsMobile } from '../../../hooks/useIsMobile';
import SectionHeader from '../../../components/SectionHeader';
import CloseButton from '../../../components/CloseButton';

export default function CommunicationModal({
    open,
    setOpen,
    type,
    remplazoMensaje = [],
    remplazoTitulo = []
}: any) {
    const handleClose = () => setOpen(false);

    const { isMobile } = useIsMobile();
    const texto = `La terminal {{empresaTerminal.nombre}} asigno sitio de atraque para la embarcacion {{buque.nombre}}`;
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '95%' : '60%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 5,
        paddingX: isMobile ? 1 : 8,
        paddingY: 4,
        paddingBottom: 10
    };

    const arrDate = type === 'title' ? remplazoTitulo : remplazoMensaje;

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <CloseButton position="right" onClose={handleClose} />
                    <SectionHeader>
                        <SectionHeader.DrawerTitle>
                            Parámetros para textos ID
                        </SectionHeader.DrawerTitle>
                    </SectionHeader>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Recuerde que para poder colocar en el texto parámetros de ID para Buques,
                        IMO u otros debe utilizar la siguiente lista:
                    </Typography>
                    <Box
                        sx={{
                            paddingY: 2,
                            ml: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            fontSize: isMobile ? 12 : 16
                        }}
                    >
                        {arrDate.map((data: string) => (
                            <Box sx={{ paddingY: 2 }} key={Math.floor(Math.random() * 99)}>
                                -- {data} --
                            </Box>
                        ))}
                    </Box>
                    <Box
                        sx={{
                            borderRadius: 2,
                            border: '1px solid #000',
                            paddingX: isMobile ? 1 : 4,
                            paddingY: 3
                        }}
                    >
                        {texto}
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
