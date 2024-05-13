import { hideAlert } from '../../features/slices/applicationSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { useIsMobile } from '../../hooks/useIsMobile';
import Button from '@mui/material/Button';
import CancelAlert from '../../assets/animations/cancelAlert.json';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InfoAlert from '../../assets/animations/infoAlert.json';
import Lottie from 'lottie-react';
import ReactDOM from 'react-dom';
import styles from './styles.module.css';
import SuccessAlert from '../../assets/animations/successAlert.json';

interface AlertProps {
    title?: string;
    message?: string;
    buttonText?: string;
    customButtons?: JSX.Element | null;
    confirmAction?: (value: any) => any;
    cancelAction?: (value: any) => any;
    icon?: string | undefined;
    itemData?: any;
    confirmText?: string;
    cancelText?: string;
    reactElement?: any;
    keepMounted?: boolean;
}
export function AlertDialog(props: AlertProps) {
    const {
        title,
        message,
        keepMounted = false,
        reactElement,
        confirmAction,
        cancelAction,
        itemData,
        customButtons,
        confirmText,
        cancelText,
        icon
    } = props;

    const RenderAnimation = () => {
        const animatedIcon: { [key: string]: any } = {
            info: InfoAlert,
            success: SuccessAlert,
            cancel: CancelAlert
        };

        return (
            <Lottie
                style={{ height: 150, marginBottom: 30 }}
                animationData={icon ? animatedIcon[icon] : animatedIcon['success']}
            />
        );
    };

    const dispatch = useAppDispatch();
    const { isMobile } = useIsMobile();

    const handleClose = () => dispatch(hideAlert());

    const handleAction = () => {
        handleClose();

        if (confirmAction) return confirmAction(itemData);
    };

    return (
        <Dialog
            className={styles.dialogstyle}
            open={!!props}
            onClose={
                keepMounted
                    ? () => {
                          return;
                      }
                    : handleClose
            }
            aria-labelledby="alert-agp"
            data-testid="alert-component"
            fullWidth={true}
            disableEscapeKeyDown
            sx={{
                textAlign: 'center',
                borderRadius: '10px',
                '& .MuiPaper-root': {
                    borderRadius: '10px',
                    width: 'auto',
                    minWidth: isMobile ? 'auto' : '440px'
                },
                '& .MuiDialogActions-root': {
                    margin: '23px',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column-reverse',
                    '& button': {
                        margin: '10px 0',
                        borderRadius: '20px',
                        minWidth: '150px',
                        textTransform: 'capitalize',
                        fontSize: '14px'
                    }
                },
                '& .MuiDialogContent-root': {
                    padding: '0 24px',
                    overflowWrap: 'break-word'
                }
            }}
        >
            <div className={styles['alert-container']}>
                <RenderAnimation />

                <DialogTitle id="alert-dialog-title" className={styles.title}>
                    {title}
                </DialogTitle>
                {message && (
                    <DialogContent>
                        <DialogContentText>{message}</DialogContentText>
                    </DialogContent>
                )}
                {reactElement && <DialogContent>{reactElement}</DialogContent>}
                <DialogActions>
                    {customButtons ? (
                        customButtons
                    ) : (
                        <>
                            {cancelText && (
                                <Button variant="outlined" onClick={cancelAction || handleClose}>
                                    {cancelText}
                                </Button>
                            )}
                            <Button
                                className={styles.button}
                                onClick={handleAction}
                                variant="contained"
                            >
                                {confirmText || 'Aceptar'}
                            </Button>
                        </>
                    )}
                </DialogActions>
            </div>
        </Dialog>
    );
}

export default function Alert() {
    const propsRedux = useAppSelector((state) => state.application.alert);
    const alertElement = document.getElementById('alert')!;
    if (Object.keys(propsRedux).length < 1) return null;
    return ReactDOM.createPortal(<AlertDialog {...propsRedux} />, alertElement);
}
