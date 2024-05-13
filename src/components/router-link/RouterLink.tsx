import {
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { forwardRef, PropsWithChildren, ReactNode, useMemo } from 'react';
import {
    NavLink,
    NavLinkProps,
} from 'react-router-dom';

type RouterLinkProps = PropsWithChildren<{
    to: string;
    text: string;
    icon: ReactNode;
}>

const RouterLink = (props: RouterLinkProps) => {
    type MyNavLinkProps = Omit<NavLinkProps, 'to'>;
    const MyNavLink = useMemo(() => forwardRef<HTMLAnchorElement, MyNavLinkProps>((navLinkProps, ref) => {
        const { className: previousClasses, ...rest } = navLinkProps;
        const elementClasses = previousClasses?.toString() ?? "";

        return (<NavLink
            {...rest}
            ref={ref}
            to={props.to}
            end
            className={({ isActive }) => (isActive ? elementClasses + " Mui-selected" : elementClasses)}
        />)
    }), [props.to]);

    return (
        <ListItemButton component={MyNavLink}>
            <ListItemIcon sx={{ '.Mui-selected > &': { color: (theme) => theme.palette.primary.main } }}>
                {props.icon}
            </ListItemIcon>
            <ListItemText primary={props.text} />
        </ListItemButton>
    )
}

export default RouterLink;
