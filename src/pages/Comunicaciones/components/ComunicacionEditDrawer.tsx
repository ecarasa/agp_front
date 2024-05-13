import Box from '@mui/material/Box';
import CloseButton from '../../../components/CloseButton';
import Drawer from '@mui/material/Drawer';
import ComunicacionesDataForm from './ComunicacionDataForm';
import { useIsMobile } from '../../../hooks/useIsMobile';

export default function ComunicacionesEditDrawer({
    open,
    setOpen,
    refrescarDatos,
    setSelected,
    setAbrirCard,
    ...props
}: any) {
    const { isMobile } = useIsMobile();
    const EditionInputManager = () => {
        switch (open) {
            case 'comInfo':
                return (
                    <ComunicacionesDataForm
                        setOpen={setOpen}
                        setAbrirCard={setAbrirCard}
                        {...props}
                    />
                );
            default:
                return <></>;
        }
    };

    return (
        <div>
            <Drawer
                anchor="right"
                open={!!open}
                onClose={() => {
                    setOpen('');
                }}
            >
                <Box
                    sx={{
                        marginTop: '64px',
                        width: '100vw',
                        height: '100%',
                        paddingY: '25px',
                        paddingX: isMobile ? '15px' : '100px',
                        '& .MuiTextField-root': { m: '8px 0', width: '100%' }
                    }}
                    role="presentation"
                >
                    <CloseButton
                        position="right"
                        onClose={() => {
                            setOpen('');
                        }}
                    />
                    <Box component="div" sx={{ textAlign: 'center' }}>
                        <EditionInputManager />
                    </Box>
                </Box>
            </Drawer>
        </div>
    );
}
