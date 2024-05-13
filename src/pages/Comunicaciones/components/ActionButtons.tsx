import { Box, Button } from '@mui/material';
import React from 'react';

interface Props {
    setOpen: (value: any) => any;
    onClickButton: () => any;
}

function ActionButtons({ setOpen, onClickButton }: Props) {
    return (
        <Box
            component="div"
            sx={{
                margin: '20px auto',
                width: '50%',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Button
                aria-label="action_buttons_accept"
                sx={{ m: 1, borderRadius: '21px' }}
                variant="contained"
                onClick={onClickButton}
            >
                Aceptar
            </Button>
            <Button
                aria-label="action_buttons_close"
                sx={{ m: 1, borderRadius: '21px' }}
                variant="outlined"
                onClick={() => {
                    setOpen('');
                }}
            >
                Cerrar
            </Button>
        </Box>
    );
}

export default ActionButtons;
