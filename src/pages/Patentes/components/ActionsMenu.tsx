import { Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ActionsMenu({
    anchorEl,
    openMenu,
    handleCloseMenu,
    selectedItemFromAction,
    handleActionMenu,
    handleUnsubscribe,
    // handleJudicializePatent,
    access
}: any) {
    const navigate = useNavigate();

    return (
        <Menu id="basic-menu" anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
            {/* {!!access?.[8]?.[44] &&
                !selectedItemFromAction?.judicializado &&
                selectedItemFromAction?.estado === 'aprobado' && (
                    <MenuItem onClick={() => handleJudicializePatent()}>
                        Judicializar patente
                    </MenuItem>
                )} */}
            {!!access?.[8]?.[36] && (
                <MenuItem onClick={() => navigate(`${selectedItemFromAction?.id}/detalle`)}>
                    Detalle de patente
                </MenuItem>
            )}
            {!!access?.[8]?.[37] && (
                <MenuItem onClick={() => handleActionMenu('history')}>
                    Historial de conversación
                </MenuItem>
            )}
            {!selectedItemFromAction?.fechaBaja && !!access?.[8]?.[38] && (
                <MenuItem
                    onClick={() => handleUnsubscribe()}
                    disabled={
                        selectedItemFromAction?.estado !== 'aprobado' ||
                        !selectedItemFromAction?.ultimoPeriodo?.actual
                    }
                >
                    Solicitar baja
                </MenuItem>
            )}
        </Menu>
    );
}

export default ActionsMenu;
