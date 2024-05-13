import { Box } from '@mui/material';
import Button from '../../button/Button';

function Acciones(props: any) {
    const {
        isDocking,
        loadingRegistration,
        liquidating,
        postingReviewNote,
        confirmAction,
        billing,
        saveDataValidation
    } = props;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '15px'
            }}
        >
            <Button
                type="outlined"
                disabled={
                    (!!billing?.file && (!billing?.nroFactura || !billing?.cotizacionDolar)) ||
                    (saveDataValidation && saveDataValidation())
                }
                onClick={() => confirmAction('guardar')}
                loading={loadingRegistration}
            >
                Guardar
            </Button>
            {isDocking && (
                <Button
                    type="outlined"
                    onClick={() => confirmAction('revision')}
                    loading={postingReviewNote}
                >
                    Enviar a Revisión
                </Button>
            )}
            <Button
                type="contained"
                onClick={() => confirmAction('finalizar')}
                disabled={!billing?.cotizacionDolar}
                loading={liquidating}
            >
                Finalizar
            </Button>
        </Box>
    );
}

export default Acciones;
