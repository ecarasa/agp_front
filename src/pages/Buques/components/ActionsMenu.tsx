import { Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ActionsMenu = ({
    anchorEl,
    menuOpen,
    handleCloseMenu,
    handleManageMenu,
    itemSelected,
    setSelected,
    handleOpenCard,
    access
}: any) => {
    const navigate = useNavigate();

    return (
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <MenuItem
                onClick={() => navigate(`${itemSelected?.id}/historico`)}
                disabled={!access?.[1]?.[33]}
            >
                Info Histórica
            </MenuItem>
            <MenuItem onClick={() => navigate(`${itemSelected?.id}/certificados/historico`)}>
                Historial Certificados
            </MenuItem>

            {!!access?.[1]?.[17] && (
                <MenuItem
                    disabled={['AP', 'RE', 'BO'].includes(itemSelected?.estado)}
                    onClick={() => handleManageMenu('approve', itemSelected)}
                >
                    Aprobar
                </MenuItem>
            )}
            {!!access?.[1]?.[17] && (
                <MenuItem
                    disabled={['RE', 'BO', 'AP'].includes(itemSelected?.estado)}
                    onClick={() => {
                        handleManageMenu('reject', itemSelected);
                    }}
                >
                    Rechazar
                </MenuItem>
            )}
            {!!access?.[1]?.[3] && !!access?.[1]?.[16] && (
                <MenuItem
                    onClick={() => {
                        handleCloseMenu();
                        setSelected(itemSelected);
                        handleOpenCard();
                    }}
                >
                    Editar Datos
                </MenuItem>
            )}
            <MenuItem onClick={() => handleManageMenu('view-certificates', itemSelected)}>
                Ver Certificados
            </MenuItem>
        </Menu>
    );
};

export default ActionsMenu;
