import { Box, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styles from '../styles.module.css';
import useLogin, { HELPERTEXT } from '../hook/useLogin';

const PasswordRecovery = () => {
    const { t } = useTranslation('userForm');
    const navigate = useNavigate();

    const {
        step,
        setStep,
        usuario,
        setUsuario,
        error,
        setNewPassword,
        newPassword,
        recoveryPasswordHandler,
        showPassword,
        handleShowPassword,
        restorePassword,
        email,
        setEmail,
        emailHidden,
        verificationCode,
        setVerificationCode,
        loading
    } = useLogin();

    return (
        <>
            {step === 1 && (
                <>
                    <Box style={{ maxHeight: '100%', maxWidth: '100%' }}>
                        <h3>Ingresá tu usuario para restablecer la contraseña</h3>
                        <p style={{ padding: '10px' }}>
                            Te enviaremos un correo con las instrucciones para restablecer tu
                            contraseña.
                        </p>
                    </Box>
                    <TextField
                        required
                        name="email"
                        className={styles.formElement}
                        label="Ingresá tu email"
                        value={email || ''}
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                        error={!!error}
                    />
                    <TextField
                        required
                        name="usuario"
                        className={styles.formElement}
                        label="Ingresá tu usuario"
                        value={usuario || ''}
                        autoComplete="off"
                        onChange={(e) => setUsuario(e.target.value)}
                        variant="outlined"
                        error={!!error}
                    />
                    <Button
                        className={styles.btnSubmit}
                        variant="contained"
                        onClick={recoveryPasswordHandler}
                        disabled={loading}
                    >
                        {t('confirm')}
                    </Button>
                    <Button
                        className={styles.btnSubmit}
                        variant="text"
                        onClick={() => navigate('/')}
                    >
                        {t('goBack')}
                    </Button>
                    {!!error && <p style={{ color: 'red' }}>{error}</p>}
                </>
            )}
            {step === 2 && (
                <>
                    <Box style={{ maxHeight: '100%', maxWidth: '100%', textAlign: 'left' }}>
                        <h3>¡Listo!</h3>
                        <p style={{ padding: '0px' }}>
                            {`Te enviamos un correo a ${emailHidden()} con las instrucciones para
                            restablecer tu contraseña`}
                        </p>
                    </Box>
                    <Button
                        className={styles.btnSubmit}
                        variant="contained"
                        onClick={() => setStep(3)}
                    >
                        {t('continue')}
                    </Button>
                </>
            )}
            {step === 3 && (
                <>
                    <TextField
                        required
                        name="verificationCode"
                        className={styles.formElement}
                        label={t('verificationCode')}
                        type="text"
                        value={verificationCode || ''}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        variant="outlined"
                        error={!!error}
                    />
                    <TextField
                        required
                        name="password"
                        className={styles.formElement}
                        type={showPassword.password ? 'text' : 'password'}
                        id="filled-required"
                        label={t('password')}
                        value={newPassword?.password1 || ''}
                        onChange={(e) =>
                            setNewPassword({ ...newPassword, password1: e.target.value })
                        }
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => handleShowPassword('password')}
                                        edge="end"
                                    >
                                        {showPassword.password ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        variant="outlined"
                        error={!!error}
                        helperText={!error && HELPERTEXT}
                    />
                    <TextField
                        required
                        name="confirmPassword"
                        className={styles.formElement}
                        label={t('passwordConfirm')}
                        type={showPassword.passwordConfirm ? 'text' : 'password'}
                        value={newPassword?.password2 || ''}
                        onChange={(e) =>
                            setNewPassword({ ...newPassword, password2: e.target.value })
                        }
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => handleShowPassword('passwordConfirm')}
                                        edge="end"
                                    >
                                        {showPassword.passwordConfirm ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        variant="outlined"
                        error={!!error}
                    />
                    <Button
                        className={styles.btnSubmit}
                        variant="contained"
                        onClick={restorePassword}
                    >
                        {t('restorePassword')}
                    </Button>
                    {!!error && <p style={{ color: 'red' }}>{error}</p>}
                </>
            )}
        </>
    );
};

export default PasswordRecovery;
