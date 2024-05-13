import { Box, Divider, Grid, IconButton, InputAdornment, Tooltip } from '@mui/material';
import { HELPERTEXT } from '../../pages/Login/hook/useLogin';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Button from '../button/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Input from '../Input/Input';
import styles from './styles.module.css';

function PasswordChangeDrawer(props: any) {
    const {
        data,
        errors,
        handleSubmit,
        handleChange,
        openDrawer,
        handleCloseDrawer,
        handleShowPassword,
        showPassword,
        changingPassword
    } = props;

    return (
        <>
            <Dialog
                open={openDrawer}
                onClose={handleCloseDrawer}
                sx={{
                    '& .MuiPaper-root': { border: '2px solid #87ceeb', borderRadius: '15px' }
                }}
            >
                <DialogTitle className={styles['pc-dialog-title']}>Cambiar contraseña</DialogTitle>
                <Box
                    component="form"
                    onSubmit={(e) => {
                        e?.preventDefault();
                        handleSubmit();
                    }}
                >
                    <DialogContent>
                        <Grid container spacing={2} display="flex" alignItems="center" mt={2}>
                            <Grid item xs={12}>
                                <Input
                                    required
                                    name="currentPassword"
                                    label="Contraseña actual"
                                    size="small"
                                    onChange={handleChange}
                                    value={data?.currentPassword}
                                    type={showPassword.currentPassword ? 'text' : 'password'}
                                    endIcon={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() =>
                                                    handleShowPassword('currentPassword')
                                                }
                                                edge="end"
                                            >
                                                {showPassword?.currentPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    required
                                    name="newPassword"
                                    onChange={handleChange}
                                    type={showPassword.newPassword ? 'text' : 'password'}
                                    value={data?.newPassword}
                                    label="Contraseña nueva"
                                    errors={errors}
                                    size="small"
                                    endIcon={
                                        <>
                                            <Tooltip title={HELPERTEXT} sx={{ cursor: 'pointer' }}>
                                                <HelpOutlineIcon />
                                            </Tooltip>
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() =>
                                                        handleShowPassword('newPassword')
                                                    }
                                                    edge="end"
                                                >
                                                    {showPassword?.newPassword ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        </>
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    required
                                    name="newPassword2"
                                    label="Repetir contraseña nueva"
                                    size="small"
                                    errors={errors}
                                    type={showPassword.newPassword2 ? 'text' : 'password'}
                                    onChange={handleChange}
                                    value={data?.newPassword2}
                                    endIcon={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => handleShowPassword('newPassword2')}
                                                edge="end"
                                            >
                                                {showPassword?.newPassword2 ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Divider />
                    <DialogActions sx={{ p: 3 }}>
                        <Button type="outlined" onClick={handleCloseDrawer}>
                            Cancelar
                        </Button>
                        <Button loading={changingPassword}>Guardar</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
}

export default PasswordChangeDrawer;
