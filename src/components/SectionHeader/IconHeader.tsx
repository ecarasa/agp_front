import { Box } from '@mui/material';
import { useIsMobile } from '../../hooks/useIsMobile';
import AddIcon from '@mui/icons-material/Add';
import Button from '../button/Button';

export const IconHeader = ({ text, onClick }: any) => {
    const { isMobile } = useIsMobile();
    if (!text) return null;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'right',
                '& span': {
                    margin: isMobile ? 0 : null
                }
            }}
        >
            <Button
                startIcon={<AddIcon />}
                onClick={onClick || null}
                style={{
                    borderRadius: '20px',
                    textTransform: 'capitalize',
                    width: 'auto',
                    minWidth: isMobile ? 'auto' : '170px'
                }}
            >
                {isMobile ? '' : text}
            </Button>
        </Box>
    );
};
