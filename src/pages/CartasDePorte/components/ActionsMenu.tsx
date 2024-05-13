import { Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ActionsMenu({
    anchorEl,
    openMenu,
    handleCloseMenu,
    selectedItemFromAction,
    downloadFile,
    isAGP,
    user
}: any) {
    const navigate = useNavigate();

    return (
        <Menu id="basic-menu" anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
            <MenuItem onClick={() => navigate(`${selectedItemFromAction.id}/detalle`)}>
                Consultar
            </MenuItem>
            <MenuItem
                onClick={() => navigate(`${selectedItemFromAction.id}/edicion`)}
                disabled={
                    user?.empresa?.id !== selectedItemFromAction?.agenciaFerroviaria?.id ||
                    !['Pendiente', 'Impresa', 'Modificada'].includes(selectedItemFromAction?.estado)
                }
            >
                Editar
            </MenuItem>
            {isAGP && (
                <MenuItem onClick={() => navigate(`${selectedItemFromAction.id}/inspeccion`)}>
                    Inspeccionar
                </MenuItem>
            )}
            <MenuItem
                onClick={() => {
                    downloadFile(selectedItemFromAction.id);
                }}
            >
                Imprimir PDF
            </MenuItem>
        </Menu>
    );
}

export default ActionsMenu;
