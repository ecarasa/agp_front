import _ from 'lodash';
import {
    Box,
    Card,
    CardActions,
    CardContent,
    Collapse,
    IconButton,
    IconButtonProps,
    Link,
    Tooltip
} from '@mui/material';
import { getIcon } from '../index';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import styles from '../styles.menu.module.css';

const CardComponent = styled(Card)`
    cursor: pointer;
    box-shadow: none;
    margin: 12px 0px;
    background-color: transparent;
    font-weight: 700;
    color: var(--white);
    font-size: 18px;
    button {
        margin-left: inherit;
        svg {
            color: white;
        }
    }
    & .MuiCardContent-root:last-child {
        padding-bottom: 0;
    }
    & .MuiCollapse-root {
        & .MuiTypography-root {
            color: var(--white);
            text-transform: capitalize;
            margin: 10px 0;
        }
    }
`;

const hoverStyles = () => ({
    '& .MuiCardActions-root:hover': {
        color: '#00bfff',
        '& button svg': {
            color: '#00bfff'
        },
        '& span:hover': {
            fontSize: '19px'
        }
    },
    '& .MuiLink-root span:hover': {
        color: '#00bfff',
        fontSize: '19px'
    }
});

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
    })
}));

function MenuAccessItem({ item, sideMenu, handleDrawerToggle, open }: any) {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const textTransform = (value: string) =>
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

    useEffect(() => {
        if (sideMenu && !open && expanded) {
            handleExpandClick();
        }
        // eslint-disable-next-line
    }, [open, expanded, sideMenu]);

    const functionsCount = (fns: any) => {
        const initialValue = 0;
        const value = fns?.reduce(
            (total: any, currentValue: any) => total + currentValue?.visualizarMenu,
            initialValue
        );

        return value;
    };

    const getExpandIcons = () => {
        if (sideMenu) {
            return <ArrowDropDownOutlinedIcon />;
        } else {
            return expanded ? <RemoveIcon /> : <AddIcon />;
        }
    };

    const getPath = () =>
        item?.funcionalidades?.filter((i: any) => i.visualizarMenu)[0]?.urlRedireccion;

    if (!item?.funcionalidades?.some((i: any) => i?.visualizarMenu)) return null;

    return (
        <CardComponent sx={{ ...hoverStyles() }}>
            <CardActions
                onClick={() => {
                    if (functionsCount(item?.funcionalidades) > 1) {
                        handleExpandClick();
                        if (!open && handleDrawerToggle) handleDrawerToggle();
                    } else {
                        navigate(`${getPath()}`);
                        if (open && handleDrawerToggle) handleDrawerToggle();
                    }
                }}
                className={styles[`${sideMenu ? 'grouper-header-side' : 'grouper-header'}`]}
            >
                <Box>
                    {sideMenu && !open ? (
                        <Tooltip title={textTransform(item?.nombre)} placement="right">
                            {getIcon(item?.id)}
                        </Tooltip>
                    ) : (
                        <>{getIcon(item?.id)}</>
                    )}
                    <span>{item?.nombre}</span>
                </Box>
                {functionsCount(item?.funcionalidades) > 1 && (
                    <ExpandMore expand={expanded} aria-expanded={expanded} aria-label="show more">
                        {getExpandIcons()}
                    </ExpandMore>
                )}
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ p: '0 16px' }}>
                    {item?.funcionalidades?.map((fn: any, index: number) => {
                        if (fn.visualizarMenu) {
                            return (
                                <Link
                                    className={styles['collapsed-items-menu']}
                                    onClick={() => {
                                        navigate(`${fn.urlRedireccion}`);
                                        sideMenu && handleDrawerToggle();
                                    }}
                                    key={index}
                                    component="div"
                                >
                                    <span>{fn.nombre}</span>
                                </Link>
                            );
                        } else return null;
                    })}
                </CardContent>
            </Collapse>
        </CardComponent>
    );
}

export default MenuAccessItem;
