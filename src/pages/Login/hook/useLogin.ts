import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    useLoginMutation,
    useConfirmUserMutation,
    useForgotPasswordMutation,
    useConfirmForgotPasswordMutation
} from '../../../features/auth/authApi';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { showAlert } from '../../../features/slices/applicationSlice';

type NewPasswordType = {
    password1: string;
    password2: string;
};

interface ShowPasswordType {
    [key: string]: boolean;
}

export const HELPERTEXT =
    'Debe contener mínimo 8 caracteres, al menos un número, una minúscula, una mayúscula y un caracter especial.';

const useLogin = () => {
    const [usuario, setUsuario] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [step, setStep] = useState<number>(1);
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<ShowPasswordType>({
        password: false,
        passwordConfirm: false,
        verificationCode: false
    });
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [newPassword, setNewPassword] = useState<NewPasswordType>({
        password1: '',
        password2: ''
    });
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();
    const [confirmUser, { isError, isSuccess }] = useConfirmUserMutation();
    const [forgotPassword] = useForgotPasswordMutation();
    const [confirmForgotPassword] = useConfirmForgotPasswordMutation();

    const handleSubmit = async () => {
        if (!usuario || !password) return setError('¡Complete los campos!');
        setLoading(true);
        try {
            const data: { [key: string]: string } = {
                usuario: usuario,
                password: password
            };
            let formBody: string[] | string = [];
            for (let property in data) {
                const encodedKey = encodeURIComponent(property);
                const encodedValue = encodeURIComponent(data[property]);
                formBody.push(encodedKey + '=' + encodedValue);
            }
            formBody = formBody.join('&');

            await login(formBody).unwrap();
            setError('');
            navigate('/agp');
        } catch (error: any) {
            setError(error?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const handleShowPassword = (value: string) => {
        setShowPassword({
            ...showPassword,
            [value]: !showPassword[value]
        });
    };

    const validatePassword = () => {
        const { password1, password2 } = newPassword;
        if (!password2 || !password1) {
            setError('Complete los campos');
            return false;
        } else if (password1.length < 8) {
            setError('La contraseña debe contener al menos 8 caracteres');
            return false;
        } else if (password1 !== password2) {
            setError('Las contraseñas deben ser iguales');
            return false;
        }
        return true;
    };

    const handleConfirmUser = async () => {
        const value = validatePassword();
        if (!value) return;

        setLoading(true);
        setError('');
        const data = {
            usuario: usuario,
            passwordTemporal: verificationCode,
            newPassword: newPassword.password2
        };
        try {
            await confirmUser(data).unwrap();

            const handleGoBack = () => navigate('/login');
            dispatch(
                showAlert({
                    title: '¡Usuario confirmado exitosamente!',
                    confirmAction: handleGoBack
                })
            );
        } catch (error: any) {
            if (Array.isArray(error?.data?.message)) {
                setError(error?.data?.message[0]);
            } else {
                setError(error?.data?.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const recoveryPasswordHandler = async () => {
        setLoading(true);
        const data = {
            usuario: usuario,
            email: email
        };
        try {
            await forgotPassword(data).unwrap();
            dispatch(
                showAlert({
                    title: '¡Se envió un email a tu casilla de correo!'
                })
            );
            setStep(2);
        } catch (error: any) {
            setError(error?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const restorePassword = async () => {
        const value = validatePassword();
        if (!value) return;

        setLoading(true);
        const data = {
            usuario: usuario,
            confirmationCode: verificationCode,
            newPassword: newPassword.password2
        };

        try {
            await confirmForgotPassword(data).unwrap();

            const handleGoBack = () => navigate('/login');
            dispatch(
                showAlert({
                    title: '¡Contraseña modificada con éxito!',
                    confirmAction: handleGoBack
                })
            );
        } catch (error: any) {
            setError(error?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const emailHidden = () => {
        const value = email;
        const chars = 3; // Cantidad de caracters visibles

        const res = value.replace(
            /[a-z0-9\-_.]+@/gi,
            (c) =>
                c.substring(0, chars) +
                c
                    .split('')
                    .slice(chars, -1)
                    .map((v) => '*')
                    .join('') +
                '@'
        );
        return res;
    };

    return {
        step,
        email,
        error,
        usuario,
        loading,
        password,
        newPassword,
        showPassword,
        verificationCode,
        setStep,
        setEmail,
        setError,
        setUsuario,
        emailHidden,
        setPassword,
        handleSubmit,
        setNewPassword,
        restorePassword,
        setShowPassword,
        handleConfirmUser,
        handleShowPassword,
        setVerificationCode,
        recoveryPasswordHandler
    };
};

export default useLogin;
