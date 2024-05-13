import { Box, Step, StepButton, Stepper } from '@mui/material';
import { useState } from 'react';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AdjustIcon from '@mui/icons-material/Adjust';

function StepperComponent({ steps }: any) {
    const [step, setStep] = useState<number>(1);

    const stepButtonFunction = (item: any) => {
        if (step === item.value) return <AdjustIcon color="primary" />;
        if (item.value < step) return <CheckCircleRoundedIcon color="success" />;
        else return <PanoramaFishEyeIcon color="disabled" />;
    };

    return (
        <Box justifyContent="center" sx={{ display: 'flex', mb: 4 }}>
            <Stepper activeStep={step} alternativeLabel>
                {steps?.map((item: any) => (
                    <Step key={item.label}>
                        <StepButton disabled icon={stepButtonFunction(item)} color="inherit">
                            {item.label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}

export default StepperComponent;
