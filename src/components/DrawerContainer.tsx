import { Box, Drawer } from '@mui/material';
import { useIsMobile } from '../hooks/useIsMobile';
import CloseButton from './CloseButton';
import SectionHeader from './SectionHeader';

interface Props {
    openDrawer: boolean;
    handleCloseDrawer: () => void | any;
    handleSubmit: () => void;
    children: any;
    title: string;
}

function DrawerContainer({ openDrawer, handleCloseDrawer, handleSubmit, children, title }: Props) {
    const { isMobile } = useIsMobile();

    return (
        <Drawer anchor="right" open={openDrawer} onClose={handleCloseDrawer}>
            <Box
                sx={{
                    marginTop: '64px',
                    width: isMobile ? '100vw' : 420,
                    height: '100%',
                    padding: '20px',
                    '& .MuiTextField-root': { m: '8px 0', width: '100%' },
                    '& .MuiFormControl-root': { m: '8px 0', width: '100%' }
                }}
                role="presentation"
            >
                <CloseButton position="right" onClose={handleCloseDrawer} />
                <Box
                    component="form"
                    onSubmit={(e: any) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    sx={{ padding: '10px', gap: '10px', display: 'grid' }}
                >
                    <p className="info-card-title">{title}</p>
                    {children}
                </Box>
            </Box>
        </Drawer>
    );
}

export default DrawerContainer;
