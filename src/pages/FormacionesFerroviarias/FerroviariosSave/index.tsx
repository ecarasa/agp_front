import { Box, Step, StepButton, Stepper } from '@mui/material';
import AdjustIcon from '@mui/icons-material/Adjust';
import ButtonActions from '../../../components/ButtonActions';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import SectionHeader from '../../../components/SectionHeader';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import useFerroviariosSave from './hooks/useFerroviariosSave';
import WaybillAssignmentDrawer from './components/WaybillAssignmentDrawer';

const steps = ['Formación', 'Asignar Carta de Porte'];
function FerroviariosSave() {
    const { activeStep, setActiveStep, getDisabled, submitting, handleSubmit, ...props } =
        useFerroviariosSave();

    const stepButtonFunction = (index: number) => {
        if (activeStep === 1 && index === 0) return <AdjustIcon color="primary" />;
        if (activeStep === 1 && index === 1) return <PanoramaFishEyeIcon color="disabled" />;
        if (activeStep !== 1 && index === 0) return <CheckCircleRoundedIcon color="success" />;
        else return <AdjustIcon color="primary" />;
    };

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>Alta de Formación</SectionHeader.Title>
            </SectionHeader>

            <Box component="div" sx={{ padding: { sm: 0, md: '0 65px' } }} justifyContent="center">
                <Box justifyContent="center" sx={{ display: 'flex', mb: 4 }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepButton
                                    disabled
                                    icon={stepButtonFunction(index)}
                                    color="inherit"
                                >
                                    {label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                {activeStep === 1 ? <StepOne {...props} /> : <StepTwo {...props} />}

                <Box
                    mt={6}
                    sx={{
                        '& .MuiBox-root': { flexDirection: { xs: 'column-reverse', md: 'row' } }
                    }}
                >
                    <ButtonActions
                        returnText="Anterior"
                        confirmText={activeStep === 1 ? 'Siguiente' : 'Finalizar'}
                        renderBackAction={activeStep === 2}
                        loading={submitting}
                        disabled={getDisabled()}
                        handleClose={() => setActiveStep(1)}
                        onClick={() => {
                            if (activeStep === 2) return handleSubmit();
                            setActiveStep(activeStep + 1);
                        }}
                    />
                </Box>
            </Box>
            <WaybillAssignmentDrawer {...props} />
        </>
    );
}

export default FerroviariosSave;
