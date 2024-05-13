import { Box, Drawer } from '@mui/material';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import AssemblerTenantForm from './AssemblerTenantForm';
import CloseButton from '../../../../components/CloseButton';
import ShipInfoForm from './ShipInfoForm';
import ShipMeasureForm from './ShipMeasureForm';

function ShipEditDrawer({ open, setOpen, ...props }: any) {
    const { isMobile } = useIsMobile();

    const EditionInputManager = () => {
        switch (open) {
            case 'shipInfo':
                return <ShipInfoForm setOpen={setOpen} open={open} {...props} />;
            case 'measurementsInfo':
                return <ShipMeasureForm setOpen={setOpen} open={open} {...props} />;
            case 'assemblerTenantinfo':
                return <AssemblerTenantForm setOpen={setOpen} open={open} {...props} />;
            default:
                return <></>;
        }
    };

    return (
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
                    width: isMobile ? '100vw' : 420,
                    height: '100%',
                    padding: '20px',
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
    );
}

export default ShipEditDrawer;
