import { Alert, Grid } from '@mui/material';
import { getDockingRenewalIcon } from '../../../../utils/functions';
import Loading from '../../../../components/Loading';
import styles from '../../../Giros/styles.module.css';

function RenewalAlert(props?: any) {
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
                </span>
            </Alert>
        </Grid>
    );
}

export default RenewalAlert;
