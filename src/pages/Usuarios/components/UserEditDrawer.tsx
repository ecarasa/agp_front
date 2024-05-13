import { useIsMobile } from '../../../hooks/useIsMobile';
import Box from '@mui/material/Box';
import CloseButton from '../../../components/CloseButton';
import Drawer from '@mui/material/Drawer';
import UserContactForm from './UserContactForm';
import UserDataForm from './UserDataForm';
import UserRolesForm from './UserRolesForm';

export default function UserEditDrawer({
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
            case 'userInfo':
                return <UserDataForm setOpen={setOpen} setAbrirCard={setAbrirCard} {...props} />;
            case 'contactUserInfo':
                return <UserContactForm setOpen={setOpen} setAbrirCard={setAbrirCard} {...props} />;
            case 'rolesUserInfo':
                return (
                    <UserRolesForm
                        setOpen={setOpen}
                        refrescarDatos={refrescarDatos}
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
