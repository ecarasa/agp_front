import { Grid } from '@mui/material';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import styles from '../../styles.module.css';
import ShipDimensionsForm from './ShipDimensionsForm';

function StepTwo(props: any) {
    return (
        <>
            <Accordion
                expanded={true}
                sx={{
                    boxShadow: 'none',
                    margin: '15px 0',
                    '& .MuiAccordionSummary-root': {
                        height: '48px'
                    },
                    position: 'static'
                }}
            >
                <AccordionSummary
                    sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12);', margin: 0 }}
                    className={styles['collapseTitle']}
                >
                    <p>Dimensiones del Buque</p>
                </AccordionSummary>
                <AccordionDetails sx={{ marginTop: '15px' }}>
                    <Grid container justifyContent="flex-start" spacing={4}>
                        <ShipDimensionsForm {...props} />
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </>
    );
}

export default StepTwo;
