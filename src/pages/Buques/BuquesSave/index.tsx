import { Box } from '@mui/material';
import { showAlert } from '../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import AdjustIcon from '@mui/icons-material/Adjust';
import ButtonActions from '../../../components/ButtonActions';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import SectionHeader from '../../../components/SectionHeader';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import StepOne from './components/StepOne';
import Stepper from '@mui/material/Stepper';
import StepTwo from './components/StepTwo';
import useBuquesSave from './hooks/useBuquesSave';

const steps = ['Identificación', 'Dimensiones'];

function BuquesSave() {
    const dispatch = useAppDispatch();
    const { validateData, handleSubmit, activeStep, setActiveStep, postingShip, ...props } =
        useBuquesSave();

    const stepButtonFunction = (index: number) => {
        if (activeStep === 1 && index === 0) return <AdjustIcon color="primary" />;
        if (activeStep === 1 && index === 1) return <PanoramaFishEyeIcon color="disabled" />;
        if (activeStep !== 1 && index === 0) return <CheckCircleRoundedIcon color="success" />;
        else return <AdjustIcon color="primary" />;
    };

    const confirmSubmit = () => {
        const submitData = async () => await handleSubmit();

        dispatch(
            showAlert({
                message: '¿Deseas dar de alta este nuevo Buque?',
                title: 'Alta de Buque',
                confirmAction: submitData,
                confirmText: 'Aceptar',
                cancelText: 'Cerrar',
                icon: 'info'
            })
        );
    };

    const getAction = async () => {
        if (activeStep === 1) {
            try {
                const response: any = await validateData();
                if (response === 'nameExist') {
                    dispatch(
                        showAlert({
                            message: 'El nombre de buque ya existe. ¿Deseas continuar?',
                            title: 'Alta de Buque',
                            confirmAction: setActiveStep,
                            itemData: 2,
                            confirmText: 'Aceptar',
                            cancelText: 'Cerrar',
                            icon: 'info'
                        })
                    );
                } else if (response !== 'err') {
                    setActiveStep(2);
                } else window.scrollTo(0, 0);
            } catch (e) {
                console.error(e);
            }
        } else {
            confirmSubmit();
        }
    };

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>Alta de buque</SectionHeader.Title>
            </SectionHeader>

            <Box
                component="form"
                sx={{ padding: { sm: 0, md: '0 65px' } }}
                justifyContent="center"
                onSubmit={(e: any) => {
                    e.preventDefault();
                    getAction();
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
                        confirmText={activeStep === 1 ? 'Siguiente' : 'Dar de alta Buque'}
                        renderBackAction={activeStep === 2}
                        loading={postingShip}
                        handleClose={() => setActiveStep(1)}
                    />
                </Box>
            </Box>
        </>
    );
}

export default BuquesSave;
