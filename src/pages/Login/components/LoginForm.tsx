import { Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styles from '../styles.module.css';
import useLogin from '../hook/useLogin';

const LoginForm = (props: any) => {
    const { t } = useTranslation('userForm');
    const navigate = useNavigate();

    const {
        usuario,
        setUsuario,
        password,
        setPassword,
        showPassword,
        handleShowPassword,
        error,
        handleSubmit,
        loading
    } = useLogin();

    return (
        <>
            <TextField
                required
                name="user"
                className={styles.formElement}
                id="filled-required"
                label={t('user')}
                value={usuario || ''}
                onChange={(e) => setUsuario(e.target.value)}
                variant="outlined"
                error={!!error}
            />
            <TextField
                required
                name="password"
                className={styles.formElement}
                id="filled-password-input"
                label={t('password')}
                type={showPassword.password ? 'text' : 'password'}
                value={password || ''}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                error={!!error}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
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
            />
            <div className={styles.btnTextContainer}>
                <Button
                    className={styles.btnText}
                    variant="text"
                    onClick={() => navigate('recuperar-clave')}
                >
                    {t('forgotPassword')}
                </Button>
            </div>
            <Button className={styles.btnSubmit} variant="contained" onClick={handleSubmit}>
                {loading ? 'Loading...' : `${t('loginUser')}`}
                {loading && (
                    <CircularProgress style={{ margin: '0 10px' }} color="inherit" size="1.5em" />
                )}
            </Button>
            <div className={styles.btnTextContainer}>
                <Button
                    className={styles.btnText}
                    variant="text"
                    onClick={() => navigate('confirmar-usuario')}
                >
                    {t('confirmUser')}
                </Button>
            </div>
            <p style={{ color: 'red' }}>{error}</p>
        </>
    );
};

export default LoginForm;
