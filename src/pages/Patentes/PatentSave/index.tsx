import { Box, Step, StepButton, Stepper } from '@mui/material';
import { useEffect } from 'react';
import AdjustIcon from '@mui/icons-material/Adjust';
import BackdropComponent from '../../../components/Backdrop/BackdropComponent';
import ButtonActions from '../../../components/ButtonActions';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import PatentMovementRequest from './components/PatentMovementsRequest';
import PatentShipDetail from './components/PatentShipDetail';
import PatentShipOperations from './components/PatentShipOperations';
import SectionHeader from '../../../components/SectionHeader';
import useGirosSave from '../../Giros/GirosSave/hooks/useGirosSave';
import useGlobalFilters from '../../../hooks/useGlobalFilters';
import usePatentSave from './hooks/usePatentSave';

const steps = [
    { label: 'Detalle de buque', value: 1 },
    { label: 'Solicitud de sitios', value: 2 },
    { label: 'Operaciones de buque', value: 3 }
];
const SectionManager = ({ step, ...props }: any) => {
    const steps: { [key: number]: any } = {
        1: <PatentShipDetail {...props} />,
        2: <PatentMovementRequest {...props} />,
        3: <PatentShipOperations {...props} />
    };
    return steps[step] || <></>;
};

function PatentSave() {
    const { filters, debounceSearch } = useGlobalFilters();
    const { step, stepValidation, setStep, data, handleChange, ...props } = useGirosSave({
        filters
    });
    const { addingPatent, downloadingPatentFile, handleSubmitPatent, ...patentSaveProps } =
        usePatentSave({
            data,
            handleChange
        });

    const stepButtonFunction = (item: any) => {
        if (step === item.value) return <AdjustIcon color="primary" />;
        if (item.value < step) return <CheckCircleRoundedIcon color="success" />;
        else return <PanoramaFishEyeIcon color="disabled" />;
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [step]);

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>Solicitud de Patente</SectionHeader.Title>
            </SectionHeader>

            <Box
                component="form"
                sx={{ padding: { sm: 0, md: '0 65px' } }}
                justifyContent="center"
                onSubmit={(e: any) => {
                    e.preventDefault();
                    if (step < 3) setStep(step + 1);
                    else handleSubmitPatent();
                }}
            >
                <Box justifyContent="center" sx={{ display: 'flex', mb: 4 }}>
                    <Stepper activeStep={step} alternativeLabel>
                        {steps.map((item: any) => (
                            <Step key={item.label}>
                                <StepButton
                                    disabled
                                    icon={stepButtonFunction(item)}
                                    color="inherit"
                                >
                                    {item.label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                <SectionManager
                    step={step}
                    debounceSearch={debounceSearch}
                    filters={filters}
                    data={data}
                    handleChange={handleChange}
                    {...patentSaveProps}
                    {...props}
                />

                <Box mt={6}>
                    <ButtonActions
                        renderBackAction={step > 1}
                        confirmText={step === 3 ? 'Enviar' : 'Siguiente'}
                        handleClose={() => setStep(step - 1)}
                        returnText="Anterior"
                        disabled={step === 2 && !data?.movimientos?.length}
                        loading={addingPatent}
                        enableForwardIcons={step < 3}
                        enableBackIcons
                    />
                </Box>
            </Box>
            <BackdropComponent loading={downloadingPatentFile} />
        </>
    );
}

export default PatentSave;
