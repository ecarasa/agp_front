import { Button as ButtonMUI, CircularProgress } from '@mui/material';
import styles from './styles.module.css';
import styled from '@emotion/styled';

const Style = styled(ButtonMUI)`
    background-color: ${(props) => (props?.variant !== 'contained' ? 'inherit' : 'var(--primary)')};
    text-transform: capitalize;
    min-width: 120px;
    border: ${(props) =>
        props?.variant === 'text'
            ? '1px solid transparent'
            : props?.variant !== 'contained'
            ? '1px solid #3761ed'
            : '1px solid #3761ed'};
    box-shadow: ${(props) =>
        props.variant !== 'contained'
            ? 'none'
            : '0px 1px 5px rgba(0, 0, 0, 0.25), 0px 2px 2px rgba(0, 0, 0, 0.14)'};
    border-radius: 20px;
    font-weight: 500;

    &:hover {
        border: ${(props) =>
            props?.variant === 'text' ? '1px solid transparent' : '1px solid #3761ed'};
        background-color: ${(props) =>
            props?.variant === 'outlined' ? '#e2e1f4' : 'var(--white)'};
        color: var(--primary);
    }
`;

interface Props {
    children: string;
    type?: 'text' | 'outlined' | 'contained';
    startIcon?: any;
    endIcon?: any;
    onClick?: any;
    loading?: boolean;
    disabled?: boolean;
    style?: object;
    name?: string;
    strong?: boolean;
}

function Button({
    children,
    type,
    startIcon,
    endIcon,
    onClick,
    loading,
    disabled,
    style,
    name,
    strong
}: Props) {
    return (
        <>
            <Style
                name={name}
                style={style || {}}
                className={styles[`${strong ? 'button-agp-strong' : 'button-agp'}`]}
                variant={type || 'contained'}
                startIcon={startIcon || null}
                endIcon={endIcon || null}
                type={onClick ? 'button' : 'submit'}
                onClick={onClick || null}
                disabled={disabled || false}
            >
                {children}
                {loading && (
                    <CircularProgress style={{ margin: '0 10px' }} color="inherit" size="1.5em" />
                )}
            </Style>
        </>
    );
}

export default Button;
