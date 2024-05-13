import { Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ActionsMenu(props: any) {
    const {
        access,
        anchorEl,
        menuOpen,
        handleCloseMenu,
        cancelRequestHandler,
        selectedItemFromAction
    } = props;
    const navigate = useNavigate();

    return (
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleCloseMenu}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
        >
            {!!access?.[3]?.[87] && selectedItemFromAction?.estado === 'LIQUIDADO' && (
                <MenuItem
                    onClick={() => navigate(`liquidacion/${selectedItemFromAction.id}/detalle`)}
                >
                    Ver liquidación
                </MenuItem>
            )}

            <MenuItem
                disabled={selectedItemFromAction?.estado !== 'PENDIENTE' || !access?.[3]?.[75]}
                onClick={cancelRequestHandler}
            >
                Cancelar Solicitud
            </MenuItem>
        </Menu>
    );
}

export default ActionsMenu;
