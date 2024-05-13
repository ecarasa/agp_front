import _ from 'lodash';
import { Box, Step, StepButton, Stepper } from '@mui/material';
import { useParams } from 'react-router-dom';
import AdjustIcon from '@mui/icons-material/Adjust';
import BackdropComponent from '../../../components/Backdrop/BackdropComponent';
import ButtonActions from '../../../components/ButtonActions';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import SectionHeader from '../../../components/SectionHeader';
import StepOne from './components/StepOne/StepOne';
import StepTwo from './components/StepTwo/StepTwo';
import useCartaPorteSave from './hooks/useCartaPorteSave';

const steps = ['Datos de Carta de Porte', 'Alta de Vagones'];
function CartaPorteSave() {
    const { id } = useParams();
    const {
        activeStep,
        setActiveStep,
        handleAction,
        confirmSubmit,
        creatingWaybill,
        updatingWaybill,
        ...props
    } = useCartaPorteSave();

    const stepButtonFunction = (index: number) => {
        if (activeStep === 1 && index === 0) return <AdjustIcon color="primary" />;
        if (activeStep === 1 && index === 1) return <PanoramaFishEyeIcon color="disabled" />;
        if (activeStep !== 1 && index === 0) return <CheckCircleRoundedIcon color="success" />;
        else return <AdjustIcon color="primary" />;
    };

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>{id ? 'Edición' : 'Alta'} Carta de Porte</SectionHeader.Title>
            </SectionHeader>
            <Box
                component="form"
                sx={{ padding: { sm: 0, md: '0 65px' } }}
                justifyContent="center"
                onSubmit={(e: any) => {
                    e.preventDefault();
                    handleAction();
                }}
            >
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
                        confirmText={activeStep === 1 ? 'Siguiente' : 'Guardar'}
                        renderBackAction={activeStep === 2}
                        loading={creatingWaybill || updatingWaybill}
                        handleClose={() => setActiveStep(1)}
                        onClick={activeStep === 2 ? confirmSubmit : null}
                        disabled={activeStep === 2 && _.isEqual(props?.data, props?.initialData)}
                    />
                </Box>

                <BackdropComponent loading={creatingWaybill} />
            </Box>
        </>
    );
}

export default CartaPorteSave;
