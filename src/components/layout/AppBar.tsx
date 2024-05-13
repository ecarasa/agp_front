import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { drawerWidth } from '../SideMenu';

interface AppBarProps extends MuiAppBarProps {
    open: boolean;
    isMobile: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile'
})<AppBarProps>(({ theme, open, isMobile }) => ({
    zIndex: theme.zIndex.drawer + (isMobile && open ? 0 : 1),
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
        marginLeft: `${drawerWidth}px`,
        width: !isMobile ? `calc(100% - ${drawerWidth}px)` : '100%',

        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    })
}));

export default AppBar;
