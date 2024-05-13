import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import styles from '../styles.module.css';

function StateService({ data }: any) {
    return (
        <div className={styles['state-service-label']}>
            {data?.activo ? (
                <>
                    <CheckCircleRoundedIcon sx={{ color: '#6EBE64' }} />
                    <span>Activo</span>
                </>
            ) : (
                <>
                    <InfoOutlinedIcon color="primary" />
                    <span>Inactivo</span>
                </>
            )}
        </div>
    );
}

export default StateService;
