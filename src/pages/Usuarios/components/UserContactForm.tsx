import { Box } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { setStorageLoading } from '../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useEditUserMutation } from '../../../services/usersApi';
import { useState } from 'react';
import ButtonActions from '../../../components/ButtonActions';
import Input from '../../../components/Input/Input';
import SectionHeader from '../../../components/SectionHeader';

function UserContactForm({ setOpen, userData, setAbrirCard }: any) {
    const dispatch = useAppDispatch();
    const [editEstado, { isLoading: edditingUser }] = useEditUserMutation();
    const [phone, setPhone] = useState<any>(userData?.telefono);
    const editarContactoDeUsuario = async () => {
        try {
            dispatch(setStorageLoading(true));
            await editEstado({ usuario: userData.usuario, telefono: phone });
            setOpen('');
            setAbrirCard(false);
            enqueueSnackbar('¡Usuario editado exitosamente!', { variant: 'success' });
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(setStorageLoading(false));
        }
    };
    return (
        <>
            <SectionHeader>
                <SectionHeader.DrawerTitle>Contacto</SectionHeader.DrawerTitle>
            </SectionHeader>
            <Box component="div" sx={{ padding: '0 10px' }}>
                <Input readOnly label="Email" name="email" value={userData?.email} />
                <Input
                    label="Tel"
                    name="telefono"
                    value={phone}
                    onChange={(e: any) => setPhone(e.target.value)}
                />
                <Box sx={{ margin: '40px 0' }}>
                    <ButtonActions
                        renderBackAction
                        returnText="Cerrar"
                        handleClose={() => setOpen(false)}
                        flexDirection="column-reverse"
                        onClick={editarContactoDeUsuario}
                    />
                </Box>
            </Box>
        </>
    );
}

export default UserContactForm;
