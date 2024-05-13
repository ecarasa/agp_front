import { Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styles from '../styles.module.css';
import useLogin, { HELPERTEXT } from '../hook/useLogin';

const UserConfirmation = () => {
    const { t } = useTranslation('userForm');
    const navigate = useNavigate();

    const {
        usuario,
        setUsuario,
        verificationCode,
        handleShowPassword,
        setVerificationCode,
        showPassword,
        newPassword,
        setNewPassword,
        error,
        handleConfirmUser,
        loading
    } = useLogin();

    return (
        <>
            <TextField
                required
                name="user"
                className={styles.formElement}
                label={t('user')}
                value={usuario || ''}
                onChange={(e) => setUsuario(e.target.value)}
                variant="outlined"
                error={!!error}
            />
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
                id="filled-required"
                label={t('password')}
                type={showPassword.password ? 'text' : 'password'}
                value={newPassword?.password1 || ''}
                onChange={(e) => setNewPassword({ ...newPassword, password1: e.target.value })}
                variant="outlined"
                error={!!error}
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
                helperText={!error && HELPERTEXT}
            />
            <TextField
                required
                name="passwordConfirm"
                className={styles.formElement}
                label={t('passwordConfirm')}
                type={showPassword.passwordConfirm ? 'text' : 'password'}
                value={newPassword?.password2 || ''}
                onChange={(e) => setNewPassword({ ...newPassword, password2: e.target.value })}
                variant="outlined"
                error={!!error}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => handleShowPassword('passwordConfirm')}
                                edge="end"
                            >
                                {showPassword.passwordConfirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
            <Button className={styles.btnSubmit} variant="contained" onClick={handleConfirmUser}>
                {t('confirmUser')}
                {loading && (
                    <CircularProgress style={{ margin: '0 10px' }} color="inherit" size="1.5em" />
                )}
            </Button>
            <Button className={styles.btnSubmit} variant="text" onClick={() => navigate('/login')}>
                {t('goBack')}
            </Button>

            {!!error && <p style={{ color: 'red' }}>{error}</p>}
        </>
    );
};

export default UserConfirmation;
