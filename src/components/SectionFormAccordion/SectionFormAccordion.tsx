import { Accordion, AccordionDetails, AccordionSummary, Grid } from '@mui/material';
import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from './styles.module.css';

function SectionFormAccordion({ title, children, staticDropDown }: any) {
    const [toggle, setToggle] = useState(true);
    return (
        <Accordion
            expanded={toggle}
            sx={{
                margin: '16px 0',
                '& .MuiAccordionSummary-root': {
                    height: '48px'
                },
                position: 'static',
                padding: '0 5px'
            }}
        >
            <AccordionSummary
                onClick={() => (staticDropDown ? null : setToggle(!toggle))}
                sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12);', margin: 0 }}
                expandIcon={staticDropDown ? null : <ExpandMoreIcon />}
                aria-controls="panel1a-content"
                className={styles['collapseTitle']}
            >
                <p>{title}</p>
            </AccordionSummary>
            <AccordionDetails sx={{ marginTop: '15px' }}>
                <Grid
                    container
                    justifyContent="flex-start"
                    spacing={4}
                    sx={{
                        '& .MuiInputBase-root': {
                            borderRadius: '10px'
                        }
                    }}
                >
                    <Grid item xs={12}>
                        <Grid
                            container
                            spacing={3}
                            mb={2}
                            columnSpacing={{ xs: 12, sm: 6, lg: 24 }}
                        >
                            {children}
                        </Grid>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
}

export default SectionFormAccordion;
