import _ from 'lodash';
import { Box, Divider } from '@mui/material';
import { Fragment } from 'react';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DirectionsBoatFilledIcon from '@mui/icons-material/DirectionsBoatFilled';
import EngineeringIcon from '@mui/icons-material/Engineering';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HouseboatIcon from '@mui/icons-material/Houseboat';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import MenuAccessItem from './components/MenuAccesItem';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import PersonIcon from '@mui/icons-material/Person';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import styles from './styles.menu.module.css';
import TrainIcon from '@mui/icons-material/Train';

interface MenuProps {
    sideMenu?: boolean | undefined;
    handleDrawerToggle?: () => void;
    open?: boolean;
}

export const getIcon = (id: number) => {
    const icons: { [key: number]: any } = {
        1: <DirectionsBoatFilledIcon />, // Buques
        2: <EventAvailableIcon />, // Giros
        3: <EngineeringIcon />, // Servicios a la Nave
        4: <TrainIcon />, // Formaciones Ferroviarias
        5: <MiscellaneousServicesIcon />, // Administración
        6: <PersonIcon />, // Usuarios
        7: <ApartmentIcon />, // Empresas
        8: <RequestPageIcon />, // Patentes
        9: <LocalFireDepartmentOutlinedIcon />, // Mercaderías Peligrosas
        99: <HouseboatIcon />
    };
    return icons[id] || icons[99];
};

function MenuComponent({ sideMenu, handleDrawerToggle, open }: MenuProps) {
    const userFunctionalities = useSelector(
        (state: RootState) => state.auth?.user?.funcionalidadesAgrupadas
    );

    const functionsCount = userFunctionalities?.reduce(
        (a: any, b: any) => a + b?.funcionalidades?.some((i: any) => i.visualizarMenu),
        0
    );

    return (
        <Box className={styles[`menucomponent-container${sideMenu ? '-side' : ''}`]}>
            {userFunctionalities?.map((item: any, index: any) => {
                return (
                    <Fragment key={index}>
                        <MenuAccessItem
                            item={item}
                            sideMenu={sideMenu}
                            open={open}
                            handleDrawerToggle={handleDrawerToggle}
                        />
                        {index < userFunctionalities?.length - 1 && functionsCount > 1 && (
                            <Divider sx={{ color: '#8C8C8C', borderWidth: '0.77px' }} />
                        )}
                    </Fragment>
                );
            })}
        </Box>
    );
}

export default MenuComponent;
