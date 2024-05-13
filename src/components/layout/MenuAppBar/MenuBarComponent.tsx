import { Box, ListItem, Menu } from '@mui/material';
import { MENU_APPBAR } from '../../../constants/menuappbar';
import { useIsMobile } from '../../../hooks/useIsMobile';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const getMenuAppBarIcon = (id: number) => {
    const icons: { [key: number]: React.ReactElement } = {
        1: <AccountCircleIcon />,
        2: <VpnKeyIcon />,
        3: <LogoutIcon />
    };

    return icons[id];
};

const menuStyles = (isMobile: boolean) => ({
    '& .MuiPaper-root': {
        width: 'auto',
        borderRadius: '15px',
        border: '2px solid #87ceeb',
        position: 'absolute',
        right: isMobile ? '14px' : '3px',
        top: '66px !important',
        left: 'auto !important',
        minWidth: '300px',
        '& .MuiList-root': {
            padding: 0,
            '& .MuiListItem-root': {
                padding: '8px 12px 8px 12px',
                color: 'var(--black)',
                '& .MuiListItemIcon-root': {
                    color: 'var(--primary)'
                }
            },
            '& hr': {
                background: '#87ceeb'
            }
        }
    },
    '& p': {
        fontSize: '15px'
    },
    '& li:hover': {
        backgroundColor: '#87ceeb',
        color: 'var(--primary)',
        cursor: 'pointer'
    }
});

function MenuBarComponent(props: any) {
    const { isMobile } = useIsMobile();
    const { anchorElNav, setAnchorElNav, menuActionManager } = props;
    return (
        <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={() => setAnchorElNav(null)}
            sx={{ ...menuStyles(isMobile) }}
        >
            {MENU_APPBAR.map((item: any) => (
                <Box key={item.id}>
                    <ListItem
                        key={item.id}
                        onClick={() => {
                            menuActionManager(item);
                            setAnchorElNav(null);
                        }}
                    >
                        <ListItemIcon>{getMenuAppBarIcon(item?.id)}</ListItemIcon>
                        <ListItemText id="switch-list-label-wifi" primary={item?.seccion} />
                    </ListItem>
                    {item?.id === 2 && <Divider />}
                </Box>
            ))}
        </Menu>
    );
}

export default MenuBarComponent;
