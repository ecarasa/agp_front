import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

function WagonStates({ states }: any) {
    const { estado, estadoInspeccion, inspectionTable } = states;

    const iconState: { [key: string]: any } = {
        Pendiente: <InfoIcon sx={{ color: '#3761ED' }} />,
        Cancelado: <CancelIcon sx={{ color: '#D40000' }} />,
        Observado: <CancelIcon sx={{ color: '#D40000' }} />,
        Inspeccionado: <CheckCircleIcon sx={{ color: '#118C29' }} />,
        Resuelto: <CheckCircleIcon sx={{ color: '#118C29' }} />,
        'Control OK': <CheckCircleIcon sx={{ color: '#118C29' }} />,
        'En Terminal': <CheckCircleIcon sx={{ color: '#118C29' }} />
    };

    if (estadoInspeccion)
        return (
            <>
                {iconState[estadoInspeccion]}
                {inspectionTable ? estadoInspeccion : estado}
            </>
        );

    return (
        <>
            {iconState[estado]}
            {estado}
        </>
    );
}

export default WagonStates;
