import { useState } from 'react';
import { Grid } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AssemblerForm from './AssemblerForm';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IdentificationForm from './IdentificationForm';
import styles from '../../styles.module.css';
import TenantForm from './TenantForm';

function StepOne(props: any) {
    const [sectionToggle, setSectionToggle] = useState({
        section1: true,
        section2: true,
        section3: true
    });
    return (
        <>
            <Accordion
                expanded={sectionToggle.section1}
                sx={{
                    margin: '15px 0',
                    '& .MuiAccordionSummary-root': {
                        height: '48px'
                    },
                    position: 'static',
                    padding: '0 5px'
                }}
            >
                <AccordionSummary
                    onClick={() =>
                        setSectionToggle({ ...sectionToggle, section1: !sectionToggle.section1 })
                    }
                    sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12);', margin: 0 }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    className={styles['collapseTitle']}
                >
                    <p>Identificación del buque</p>
                </AccordionSummary>
                <AccordionDetails sx={{ marginTop: '15px' }}>
                    <Grid
                        sx={{
                            '& .MuiInputBase-root': {
                                borderRadius: '10px'
                            }
                        }}
                        container
                        justifyContent="flex-start"
                        spacing={4}
                    >
                        <IdentificationForm {...props} />
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion
                expanded={sectionToggle.section2}
                sx={{
                    margin: '15px 0',
                    '& .MuiAccordionSummary-root': {
                        height: '48px'
                    },
                    position: 'static',
                    padding: '0 5px'
                }}
            >
                <AccordionSummary
                    onClick={() =>
                        setSectionToggle({ ...sectionToggle, section2: !sectionToggle.section2 })
                    }
                    sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12);', margin: 0 }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    className={styles['collapseTitle']}
                >
                    <p>Información Propietario</p>
                </AccordionSummary>
                <AccordionDetails sx={{ marginTop: '15px' }}>
                    <Grid
                        sx={{
                            '& .MuiInputBase-root': {
                                borderRadius: '10px'
                            }
                        }}
                        container
                        justifyContent="flex-start"
                        spacing={4}
                    >
                        <AssemblerForm {...props} />
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion
                expanded={sectionToggle.section3}
                sx={{
                    margin: '15px 0',
                    '& .MuiAccordionSummary-root': {
                        height: '48px'
                    },
                    position: 'static',
                    padding: '0 5px'
                }}
            >
                <AccordionSummary
                    onClick={() =>
                        setSectionToggle({ ...sectionToggle, section3: !sectionToggle.section3 })
                    }
                    sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12);', margin: 0 }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    className={styles['collapseTitle']}
                >
                    <p>Información Locatario</p>
                </AccordionSummary>
                <AccordionDetails sx={{ marginTop: '15px' }}>
                    <Grid
                        sx={{
                            '& .MuiInputBase-root': {
                                borderRadius: '10px'
                            }
                        }}
                        container
                        justifyContent="flex-start"
                        spacing={4}
                    >
                        <TenantForm {...props} />
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </>
    );
}

export default StepOne;
