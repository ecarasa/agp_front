import { Alert, Grid } from '@mui/material';
import { getDockingRenewalIcon } from '../../utils/functions';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import styles from './style.module.css';

function RenewalAlert(props?: any) {
    const navigate = useNavigate();
    const data = props?.giroData || null;
    if (!data?.idRenovacion && !data?.idRenovacionHijo) return <></>;

    return props?.loadingGiro || props?.fetchingGiro ? (
        <Loading />
    ) : (
        <Grid item xs={12}>
            <Alert
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '22px',
                    maxHeight: '60px',
                    borderRadius: '5px',
                    background: '#6837ED',
                    '& .MuiSvgIcon-root': {
                        color: 'var(--white)',
                        fontSize: '26px'
                    },
                    '& .MuiAlert-message span': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }
                }}
                variant="filled"
                icon={getDockingRenewalIcon(props?.giroData?.idRenovacion)}
            >
                <span className={styles['alert-link']}>
                    {data?.idRenovacion ? 'Renovación.' : 'Giro renovado.'}&nbsp;
                    <span
                        onClick={() => {
                            navigate(
                                `/agp/giros/${data?.idRenovacion || data?.idRenovacionHijo}/detalle`
                            );
                            navigate(0);
                        }}
                    >
                        {data?.idRenovacion ? 'Ir al giro original' : 'Ir a nueva solicitud'}{' '}
                    </span>
                    <ReplyAllIcon className={styles['alert-icon']} />
                </span>
            </Alert>
        </Grid>
    );
}

export default RenewalAlert;
