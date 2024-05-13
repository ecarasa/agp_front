import { FormControlLabel, Grid, RadioGroup } from '@mui/material';
import Input from '../../../../components/Input/Input';
import Radio from '@mui/material/Radio';
import SectionFormAccordion from '../../../../components/SectionFormAccordion/SectionFormAccordion';
import SelectComponent from '../../../../components/SelectComponent/SelectComponent';

function StepOne(props: any) {
    const {
        data,
        handleChange,
        railwayCompanies,
        loadingRailwayCompanies,
        parrillas,
        loadingParrillas
    } = props;
    return (
        <>
            <SectionFormAccordion title="Identificación de Formación" staticDropDown>
                <Grid item xs={12}>
                    <RadioGroup row name="ingreso">
                        <FormControlLabel
                            control={<Radio />}
                            label="Ingreso"
                            labelPlacement="start"
                            onChange={() =>
                                handleChange({
                                    target: { name: 'ingreso', value: 'ingreso' }
                                })
                            }
                            checked={data?.ingreso === 'ingreso'}
                        />
                        <FormControlLabel
                            control={<Radio />}
                            label="Egreso"
                            labelPlacement="start"
                            onChange={() =>
                                handleChange({
                                    target: { name: 'ingreso', value: 'egreso' }
                                })
                            }
                            checked={data?.ingreso === 'egreso'}
                        />
                    </RadioGroup>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <SelectComponent
                        label="Empresa Ferroviaria"
                        value={data?.idFerrocarril || ''}
                        name="idFerrocarril"
                        loading={loadingRailwayCompanies}
                        data={railwayCompanies}
                        onChange={handleChange}
                        itemValue="id"
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={data?.nroLocomotora || ''}
                        name="nroLocomotora"
                        label="Número de Locomotora"
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={data?.maquinista || ''}
                        name="maquinista"
                        label="Maquinista"
                        onChange={handleChange}
                        required
                    />
                </Grid>
            </SectionFormAccordion>
            <SectionFormAccordion title="Asignación de Parrilla" staticDropDown>
                <Grid item xs={12} sm={6}>
                    <SelectComponent
                        label="Parrilla"
                        value={data?.idParrilla || ''}
                        name="idParrilla"
                        loading={loadingParrillas}
                        data={parrillas}
                        onChange={handleChange}
                        required
                    />
                </Grid>
            </SectionFormAccordion>
        </>
    );
}

export default StepOne;
