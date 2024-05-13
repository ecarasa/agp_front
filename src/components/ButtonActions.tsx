import { Box, Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const ButtonActions = ({
    disabled = false,
    handleClose,
    renderBackAction,
    confirmText,
    returnText,
    enableForwardIcons,
    enableBackIcons,
    position,
    loading,
    flexDirection,
    onClick,
    id,
    variant,
    startIcon
}: any) => {
    const navigate = useNavigate();
    const { t } = useTranslation('userForm');
    return (
        <Box
            sx={{
                display: 'flex',
                margin: '0 auto',
                whiteSpace: 'nowrap',
                justifyContent: position || 'center',
                alignItems: 'center',
                gap: '15px',
                flexDirection: flexDirection || 'inherit',
                '& button': {
                    borderRadius: '20px',
                    textTransform: 'capitalize',
                    width: 'auto',
                    minWidth: '170px'
                },
                textAlign: 'center'
            }}
        >
            {renderBackAction && (
                <Button
                    name="button_actions_cancel"
                    color="info"
                    startIcon={enableBackIcons ? <ArrowBackIosIcon /> : false}
                    variant={variant ? variant : 'outlined'}
                    onClick={() => {
                        if (handleClose) handleClose();
                        else navigate(-1);
                    }}
                >
                    {returnText || t('goBack')}
                </Button>
            )}
            <Button
                id={id || undefined}
                name="button_actions_confirm"
                endIcon={enableForwardIcons ? <ArrowForwardIosIcon /> : false}
                startIcon={startIcon ?? false}
                color="primary"
                type={onClick ? 'button' : 'submit'}
                disabled={disabled}
                variant={variant ? variant : 'contained'}
                onClick={onClick || null}
            >
                {confirmText || t('accept')}
                {loading && (
                    <CircularProgress style={{ margin: '0 10px' }} color="inherit" size="1.5em" />
                )}
            </Button>
        </Box>
    );
};

export default ButtonActions;
