import { Alert, Box, Grid } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import styles from '../../../../components/PatentDetailContainer/patentstyles.module.css';

function JudicializedAlert({ data }: any) {
    if (!data?.judicializado) return null;

    return (
        <Grid item xs={12} mt={2}>
            <Alert className={styles['header-alert']} variant="filled" icon={<GavelIcon />}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <p>Judicializado</p>
                </Box>
            </Alert>
        </Grid>
    );
}

export default JudicializedAlert;
