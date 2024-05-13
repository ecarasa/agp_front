import { Divider, Grid } from '@mui/material';
import { ReactElement } from 'react';
import styles from '../styles-gestion.module.css';

interface Props {
    children: ReactElement;
}

function OperationButtons({ children }: Props) {
    if (!children?.props?.children?.some((i: any) => !!i)) return null;
    return (
        <>
            <Grid item xs={12} mt={1}>
                <Divider sx={{ borderWidth: '1.5px' }} />
            </Grid>
            <Grid item mt={4} xs={12} className={`flex-center ${styles['btn-actions-info-card']}`}>
                {children}
            </Grid>
        </>
    );
}

export default OperationButtons;
