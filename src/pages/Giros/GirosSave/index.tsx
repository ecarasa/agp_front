import { Box, Step, StepButton, Stepper } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { showAlert } from '../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useEffect } from 'react';
import AdjustIcon from '@mui/icons-material/Adjust';
import BackdropComponent from '../../../components/Backdrop/BackdropComponent';
import ButtonActions from '../../../components/ButtonActions';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import FragmentModalAtraque from './components/FragmentModalAtraque';
import MovementRequest from './components/MovementRequest';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import SectionHeader from '../../../components/SectionHeader';
import ShipDetail from './components/ShipDetail';
import ShipOperations from './components/ShipOperations';
import TripDetails from './components/TripDetails';
import useGirosSave from './hooks/useGirosSave';
import useGlobalFilters from '../../../hooks/useGlobalFilters';

const steps = [
    { label: 'Detalle de buque', value: 1 },
    { label: 'Detalle de viaje', value: 2 },
    { label: 'Solicitud de movimiento', value: 3 },
    { label: 'Operaciones de buque', value: 4 }
];
const SectionManager = ({ step, ...props }: any) => {
    const steps: { [key: number]: any } = {
        1: <ShipDetail {...props} />,
        2: <TripDetails {...props} />,
        3: <MovementRequest {...props} />,
        4: <ShipOperations {...props} />
    };
    return steps[step] || <></>;
};

interface RtaCrearGiro {
    buque: string;
    idGiro: string;
    mensaje: string;
    uuidConversacion: string;
    evento: string;
    fechaArribo: string;
    emisor: string;
}

function GirosSave() {
    const { filters, debounceSearch } = useGlobalFilters();
    const {
        step,
        stepValidation,
        setStep,
        handleSubmit,
        validateData,
        validatingData,
        addingShipDocking,
        downloadingFile,
        handleDownloadFile,
        abrirModalPDF,
        ...props
    } = useGirosSave({
        filters
    });
    const dispatch = useAppDispatch();

    const stepButtonFunction = (item: any) => {
        if (step === item.value) return <AdjustIcon color="primary" />;
        if (item.value < step) return <CheckCircleRoundedIcon color="success" />;
        else return <PanoramaFishEyeIcon color="disabled" />;
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [step]);

    const submit = async () => {
        const submit: RtaCrearGiro | '' = await handleSubmit();

        if (submit) {
            dispatch(
                showAlert({
                    title: '¡Solicitud de Atraque creada exitosamente!',
                    confirmText: 'Cerrar',
                    reactElement: <FragmentModalAtraque data={submit} />,
                    confirmAction: abrirModalPDF,
                    itemData: submit?.idGiro,
                    keepMounted: true
                })
            );
        } else {
            enqueueSnackbar('No se pudo crear la solicitud.', { variant: 'error' });
        }
    };

    const getAction = () => {
        if (step < 4) validateData();
        else submit();
    };

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>Solicitud de atraque</SectionHeader.Title>
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
                    stepValidation={stepValidation}
                    validatingData={validatingData}
                    {...props}
                />

                <Box mt={6}>
                    <ButtonActions
                        renderBackAction={step > 1}
                        confirmText={step === 4 ? 'Enviar' : 'Siguiente'}
                        handleClose={() => setStep(step - 1)}
                        returnText="Anterior"
                        disabled={
                            (step === 3 && !stepValidation?.thirdStepValidated) || addingShipDocking
                        }
                        loading={validatingData || addingShipDocking}
                        enableForwardIcons={step < 4}
                        enableBackIcons
                    />
                </Box>
            </Box>
            <BackdropComponent loading={downloadingFile} />
        </>
    );
}

export default GirosSave;
