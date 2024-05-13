import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Position {
    position: 'right' | 'left' | 'center';
    onClose?: () => any;
}

const CloseButton = ({ position, onClose }: Position) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: position,
                height: '20px'
            }}
        >
            <IconButton onClick={onClose} aria-label="fingerprint" color="primary">
                <CloseIcon sx={{ fontSize: '20px' }} />
            </IconButton>
        </div>
    );
};

export default CloseButton;
