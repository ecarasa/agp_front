import { useIsMobile } from '../../../hooks/useIsMobile';
import Box from '@mui/material/Box';
import CloseButton from '../../../components/CloseButton';
import Drawer from '@mui/material/Drawer';
import EmpresaDataForm from './EmpresaDataForm';
import EmpresaAssignmentsForm from './EmpresaAssignmentsForm';

export default function EmpresaEditDrawer({ open, setOpen, ...props }: any) {
    const { isMobile } = useIsMobile();

    const EditionInputManager = () => {
        switch (open) {
            case 'companyInfo':
                return <EmpresaDataForm setOpen={setOpen} {...props} />;
            case 'rolesCompanyInfo':
                return <EmpresaAssignmentsForm setOpen={setOpen} {...props} />;
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
        </div>
    );
}
