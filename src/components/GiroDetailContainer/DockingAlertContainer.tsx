import { Box } from '@mui/material';

const getText = (state: string) => {
    const dockingText: any = {
        revision: 'Enviado a revisión',
        modificando: 'Modificando'
    };
    return dockingText[state];
};
function DockingAlertContainer({ item, handleShowNote }: any) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <p>{getText(item?.estado)}</p>
            {item?.notaRevision && (
                <p
                    className="text-link"
                    style={{ color: 'var(--white)' }}
                    onClick={() => handleShowNote()}
                >
                    Ver nota
                </p>
            )}
        </Box>
    );
}

export default DockingAlertContainer;
