import { DockingIcon, UserCrown } from '../../../../components/Icons';
import AnchorRoundedIcon from '@mui/icons-material/AnchorRounded';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

interface Prop {
    group: number;
}
function NotificationIcons({ group }: Prop) {
    switch (group) {
        case 1:
            return <DirectionsBoatIcon />;
        case 2:
            return <EventAvailableIcon />;
        case 3:
            return <DockingIcon />;
        case 4:
            return <EventAvailableIcon />;
        case 5:
            return <UserCrown />;
        case 6:
            return <AnchorRoundedIcon />;
        case 7:
            return <EventAvailableIcon />;

        default:
            return <EventAvailableIcon />;
    }
}

export default NotificationIcons;
