import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from '../../button/Button';

function AddMovementButton() {
    const navigate = useNavigate();
    return (
        <Grid
            item
            xs={6}
            textAlign="right"
            sx={{
                paddingTop: '0px !important',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
            }}
        >
            <Button
                style={{
                    backgroundColor: '#fff',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                }}
                type="outlined"
                onClick={() => navigate('agregar-movimiento')}
            >
                Nuevo movimiento
            </Button>
        </Grid>
    );
}

export default AddMovementButton;
