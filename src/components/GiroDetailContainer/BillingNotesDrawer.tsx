import { Box, Drawer } from '@mui/material';
import { useIsMobile } from '../../hooks/useIsMobile';
import CloseButton from '../CloseButton';
import SectionHeader from '../SectionHeader';
import Input from '../Input/Input';
import Button from '../button/Button';

function BillingNotesDrawer(props: any) {
    const { showNote, handleShowNote, giroData } = props;
    const { isMobile } = useIsMobile();
    return (
        <Drawer anchor="right" open={showNote} onClose={handleShowNote}>
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
                <CloseButton position="right" onClose={handleShowNote} />
                <Box
                    component="div"
                    onSubmit={(e: any) => {
                        e.preventDefault();
                    }}
                    sx={{ padding: '10px', gap: '10px', display: 'grid' }}
                >
                    <SectionHeader>
                        <SectionHeader.DrawerTitle>Enviado a Revisión</SectionHeader.DrawerTitle>
                    </SectionHeader>
                    <Input label="Nota" value={giroData?.notaRevision} readOnly />
                </Box>
                <Box className="flex-center" mt={4}>
                    <Button
                        style={{ minWidth: '150px', fontWeight: 800, textTransform: 'uppercase' }}
                        type="outlined"
                        onClick={handleShowNote}
                    >
                        Cerrar
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}

export default BillingNotesDrawer;
