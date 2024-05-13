import { styled } from '@mui/material/styles';
import logoMinTransp from '../../assets/image/LogoMinTransp-white.png';

const StyledFooter = styled('footer', { label: 'footer' })(({ theme }) => ({
    display: 'inherit',
    zIndex: 1200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1, 1),
    background: '#2F2F2F',
    height: '109px',
    position: 'relative'
}));

const Container = styled('div', { label: 'container' })(({ theme }) => ({
    height: '100%',
    backgroundImage: `url(${logoMinTransp})`,
    backgroundPosition: 'right',
    backgroundRepeat: 'no-repeat',
    margin: '0 10%'
}));

const Footer = () => {
    return (
        <StyledFooter>
            <Container />
        </StyledFooter>
    );
};

export default Footer;
