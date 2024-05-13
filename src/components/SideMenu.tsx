import { CSSObject, Theme, useTheme } from '@mui/material/styles';
import { Divider, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MuiDrawer from '@mui/material/Drawer';
import MenuComponent from './Menu';

export const drawerWidth = 440;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    color: 'var(--white)',
    backgroundColor: 'var(--primary)',
    borderRight: '1px solid white',
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
    }),
    overflowX: 'hidden'
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    color: 'var(--white)',
    backgroundColor: 'var(--primary)',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`
    }
});

const DesktopDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme)
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme)
        })
    })
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--white)',
    padding: theme.spacing(0, 1),
    '& .MuiButtonBase-root': {
        color: 'var(--primary)'
    },
    '& .MuiButtonBase-root:hover': {
        backgroundColor: '#1976d2',
        borderRadius: '50%',
        color: 'var(--white)'
    },
    '& h3': {
        paddingLeft: '10px',
        color: 'var(--primary)',
        margin: 0
    },
    ...theme.mixins.toolbar
}));

type DrawerProps = {
    open: boolean;
    isMobile: boolean;
    handleDrawerToggle: () => void;
};

const SideMenu = ({ open, isMobile, handleDrawerToggle }: DrawerProps) => {
    const theme = useTheme();

    if (isMobile)
        return (
            <MuiDrawer
                id="sideMenu-mobile"
                variant="temporary"
                open={open}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: isMobile ? '100%' : drawerWidth,
                        color: 'var(--white)',
                        backgroundColor: 'var(--primary)'
                    }
                }}
            >
                <DrawerHeader>
                    <h3>Menu</h3>
                    <IconButton onClick={handleDrawerToggle}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <MenuComponent sideMenu handleDrawerToggle={handleDrawerToggle} open={open} />
            </MuiDrawer>
        );

    return (
        <DesktopDrawer
            variant="permanent"
            open={open}
            id="sideMenu-desktop"
            onClose={handleDrawerToggle}
        >
            <DrawerHeader>
                <h3>Menu</h3>
                <IconButton onClick={handleDrawerToggle}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <MenuComponent sideMenu handleDrawerToggle={handleDrawerToggle} open={open} />
        </DesktopDrawer>
    );
};

export default SideMenu;
