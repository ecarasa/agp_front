import {
    FormControlLabel,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Radio,
    RadioGroup
} from '@mui/material';
import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import ButtonActions from '../../../../components/ButtonActions';
import SectionFormAccordion from '../../../../components/SectionFormAccordion/SectionFormAccordion';
import DeleteIcon from '@mui/icons-material/Delete';
import _ from 'lodash';
import VirtualizedAutocomplete from '../../../../components/VirtualizedAutocomplete';

interface Puerto {
    id: number;
    nombre: string;
}

function TripDetails(props: any) {
    const { data, handleChange, ports, loadingPorts, stepValidation, handleValidationSteps } =
        props;
    const [tripDetail, setTripDetail] = useState<any>(null);

    const clearInputPorts = () => {
        const doc: HTMLElement = document.getElementsByClassName(
            'MuiAutocomplete-clearIndicator'
        )[0] as HTMLElement;
        if (doc) doc.click()!;
    };

    return (
        <>
            <SectionFormAccordion title="Ruta de viaje">
                <Grid item xs={12} sm={6}>
                    <VirtualizedAutocomplete
                        value={tripDetail?.puerto || ''}
                        type="search"
                        hiddeArrow
                        loading={loadingPorts}
                        templateLabel={(option: any) => `${option.id} - ${option.nombre}`}
                        onChange={(value: any) => {
                            if (!value) {
                                let newTrip = { ...tripDetail };
                                delete newTrip.puerto;
                                return setTripDetail(newTrip);
                            }
                            setTripDetail({
                                ...tripDetail,
                                puerto: value
                            });
                        }}
                        label="Puertos"
                        name="puerto"
                        options={ports || []}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'grid', alignItems: 'center' }}>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        sx={{ justifyContent: 'space-between' }}
                    >
                        <FormControlLabel
                            value="O"
                            control={<Radio />}
                            label="Procedencia"
                            checked={tripDetail?.tipo === 'O'}
                            onChange={(event: any) => {
                                setTripDetail({ ...tripDetail, tipo: event.target.value });
                            }}
                        />
                        <FormControlLabel
                            value="D"
                            control={<Radio />}
                            label="Destino"
                            checked={tripDetail?.tipo === 'D'}
                            onChange={(event: any) => {
                                setTripDetail({ ...tripDetail, tipo: event.target.value });
                            }}
                        />
                    </RadioGroup>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <ButtonActions
                        id="buttonAgregar"
                        confirmText="Agregar Puerto"
                        disabled={_.keys(tripDetail)?.length < 2}
                        onClick={() => {
                            if (
                                tripDetail?.tipo === 'O' &&
                                data?.giroPuertos?.filter((i: any) => i.tipo === 'O')?.length === 5
                            ) {
                                return enqueueSnackbar(
                                    'No se pueden agregar más puertos de procedencia',
                                    {
                                        variant: 'error'
                                    }
                                );
                            }
                            if (
                                tripDetail?.tipo === 'D' &&
                                data?.giroPuertos?.filter((i: any) => i.tipo === 'D')?.length === 5
                            ) {
                                return enqueueSnackbar(
                                    'No se pueden agregar más puertos de destino',
                                    {
                                        variant: 'error'
                                    }
                                );
                            }
                            const newTrip = {
                                idCiudad: tripDetail.puerto.id,
                                tipo: tripDetail.tipo,
                                nombre: tripDetail.puerto.nombre,
                                id: Math.floor(Math.random() * 1000)
                            };
                            if (stepValidation?.firstStepValidated) {
                                handleValidationSteps();
                            }
                            handleChange({
                                target: {
                                    name: 'giroPuertos',
                                    value: [...(data?.giroPuertos || []), ...[newTrip]]
                                }
                            });
                            setTripDetail(null);
                            clearInputPorts();
                        }}
                        variant={'outlined'}
                        position="end"
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <p>Procedencia</p>
                    <Paper
                        sx={{
                            minHeight: '260px',
                            background: '#FFFFFF',
                            boxShadow: '2px 2px 8px rgba(0, 0, 0, 38%)',
                            borderRadius: '8px'
                        }}
                    >
                        <List>
                            {data?.giroPuertos
                                ?.filter((i: any) => i.tipo === 'O')
                                .map((trip: any, index: number) => (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => {
                                                    if (stepValidation?.firstStepValidated) {
                                                        handleValidationSteps();
                                                    }
                                                    handleChange({
                                                        target: {
                                                            name: 'giroPuertos',
                                                            value: data?.giroPuertos.filter(
                                                                (i: any) => i.id !== trip.id
                                                            )
                                                        }
                                                    });
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText primary={trip?.nombre} />
                                    </ListItem>
                                ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <p>Destino</p>
                    <Paper
                        sx={{
                            minHeight: '260px',
                            background: '#FFFFFF',
                            boxShadow: '2px 2px 8px rgba(0, 0, 0, 38%)',
                            borderRadius: '8px'
                        }}
                    >
                        <List>
                            {data?.giroPuertos
                                ?.filter((i: any) => i.tipo === 'D')
                                .map((trip: any, index: number) => (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => {
                                                    if (stepValidation?.firstStepValidated) {
                                                        handleValidationSteps();
                                                    }
                                                    handleChange({
                                                        target: {
                                                            name: 'giroPuertos',
                                                            value: data?.giroPuertos.filter(
                                                                (i: any) => i.id !== trip.id
                                                            )
                                                        }
                                                    });
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText primary={trip?.nombre} />
                                    </ListItem>
                                ))}
                        </List>
                    </Paper>
                </Grid>
            </SectionFormAccordion>
        </>
    );
}

export default TripDetails;
