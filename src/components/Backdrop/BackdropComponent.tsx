import { Backdrop, CircularProgress } from '@mui/material';

interface Props {
    loading: boolean;
    fetching?: boolean | undefined;
}
function BackdropComponent({ loading, fetching }: Props) {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading || !!fetching}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}

export default BackdropComponent;
