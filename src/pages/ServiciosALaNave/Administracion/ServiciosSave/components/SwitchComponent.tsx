import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 65,
    height: 32,
    padding: 0,
    margin: '0 18px 0 12px',
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)'
        }
    },
    '& .MuiSwitch-switchBase': {
        padding: 9,
        '&.Mui-checked': {
            transform: 'translateX(30px)',
            color: '#49454F',
            '& + .MuiSwitch-track': {
                opacity: 1,
                border: '2.5px solid #79747E',
                backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#E6E0E9'
            }
        }
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 4px 8px 0 rgb(0 35 11 / 20%)',
        width: 15,
        height: 15,
        borderRadius: '50%',
        transition: theme.transitions.create(['width'], {
            duration: 200
        })
    },
    '& .MuiSwitch-track': {
        borderRadius: 16,
        opacity: 1,
        border: '2.5px solid #79747E',
        backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box'
    }
}));

function SwitchComponent({ handleChange, data }: any) {
    return (
        <AntSwitch
            onChange={handleChange}
            value={data?.activo}
            name="activo"
            checked={data?.activo || false}
        />
    );
}

export default SwitchComponent;
