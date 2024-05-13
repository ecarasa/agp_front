import { handleErrors } from '../../utils/common';
import { showAlert } from '../../features/slices/applicationSlice';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { useChangePasswordMutation } from '../../features/auth/authApi';
import { useState } from 'react';

interface PasswordProps {
    currentPassword?: string;
    newPassword?: string;
    newPassword2?: string;
}

interface ShowPasswordType {
    [key: string]: boolean;
}

function usePasswordChange({ handleLogOut }: any) {
    const dispatch = useAppDispatch();
    const [data, setData] = useState<PasswordProps | null>(null);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>(null);
    const [showPassword, setShowPassword] = useState<ShowPasswordType>({
        currentPassword: false,
        newPassword: false,
        newPassword2: false
    });
    const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();

    const handleOpenDrawer = () => {
        setOpenDrawer(true);
    };

    const handleCloseDrawer = () => {
        setOpenDrawer(false);
        setData(null);
        setErrors(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e?.target;

        if (!value) {
            let auxData: any = { ...data };
            delete auxData[name];
            setData(auxData);
        } else {
            setData({
                ...data,
                [name]: value
            });
        }
    };

    const handleSubmit = () => {
        if (data?.newPassword && data?.newPassword?.length < 8) {
            return setErrors({
                newPassword: 'La contraseña debe contener al menos 8 caracteres'
            });
        } else if (data?.newPassword !== data?.newPassword2) {
            return setErrors({
                newPassword: '',
                newPassword2: 'Las contraseñas deben ser iguales'
            });
        } else {
            setErrors(null);
        }

        const submit = async () => {
            const response: any = await changePassword({
                body: {
                    previousPassword: data?.currentPassword,
                    newPassword: data?.newPassword
                }
            });
            if (!response?.error) {
                dispatch(
                    showAlert({
                        title: 'Contraseña modificada correctamente',
                        keepMounted: true,
                        confirmText: 'Cerrar',
                        confirmAction: () => {
                            handleCloseDrawer();
                            handleLogOut();
                        }
                    })
                );
            } else {
                handleErrors(response.error);
            }
        };

        dispatch(
            showAlert({
                title: '¿Confirma que desea cambiar contraseña?',
                confirmText: 'Confirmar',
                cancelText: 'Cancelar',
                confirmAction: submit,
                keepMounted: true,
                icon: 'info'
            })
        );
    };

    const handleShowPassword = (value: string) => {
        setShowPassword({
            ...showPassword,
            [value]: !showPassword[value]
        });
    };

    return {
        data,
        errors,
        openDrawer,
        changingPassword,
        showPassword,
        setOpenDrawer,
        handleOpenDrawer,
        handleCloseDrawer,
        handleShowPassword,
        handleSubmit,
        handleChange
    };
}

export default usePasswordChange;
