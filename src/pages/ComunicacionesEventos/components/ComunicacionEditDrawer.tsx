import Box from '@mui/material/Box';
import CloseButton from '../../../components/CloseButton';
import Drawer from '@mui/material/Drawer';
import ComunicacionesEvtDataForm from './ComunicacionDataForm';
import { useIsMobile } from '../../../hooks/useIsMobile';

export default function ComunicacionesEvtEditDrawer({
    open,
    setOpen,
    refrescarDatos,
    setSelected,
    ...props
}: any) {
    const { isMobile } = useIsMobile();
    const EditionInputManager = () => {
        switch (open) {
            case 'eventInfo':
                return <ComunicacionesEvtDataForm setOpen={setOpen} {...props} />;
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
