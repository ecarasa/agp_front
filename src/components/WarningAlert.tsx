import { Alert } from '@mui/material';

function WarningAlert({ children }: any) {
    return (
        <>
            <Alert
                variant="filled"
                severity="info"
                sx={{
                    '& .MuiAlert-icon': {
                        fontSize: '30px',
                        color: '#fff'
                    },
                    fontSize: '18px',
                    color: '#555555',
                    backgroundColor: '#FAD500',
                    alignItems: 'center',
                    fontWeight: 500
                }}
            >
                {children}
            </Alert>
        </>
    );
}

export default WarningAlert;
