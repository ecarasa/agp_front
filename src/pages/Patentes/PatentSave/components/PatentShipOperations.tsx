import _ from 'lodash';
import {
    useGetAssemblersAndTenantsQuery,
    useGetChargeTypesQuery
} from '../../../../services/girosApi';
import { Checkbox, FormControlLabel, Grid, TextareaAutosize } from '@mui/material';
import Input from '../../../../components/Input/Input';
import SectionFormAccordion from '../../../../components/SectionFormAccordion/SectionFormAccordion';

function PatentShipOperations(props: any) {
    const { data, setData, errors, handleChangeFile, handleChange, teuValidation, uploadingFiles } =
        props;
    const { data: assemblersAndTenants, isLoading: loadingassemAndTent } =
        useGetAssemblersAndTenantsQuery();
    const { data: chargeTypes, isLoading: loadingChargeTypes } = useGetChargeTypesQuery();

    return (
        <>
            <SectionFormAccordion title="Información General">
                <Grid item xs={12} sm={6}>
                    <Input value={data?.buque?.agenciaMaritima?.nombre} label="Agencia" readOnly />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input value={data?.buque?.armador?.nombre} label="Propietario" readOnly />
                </Grid>
            </SectionFormAccordion>
            <SectionFormAccordion title="Operacion del Buque">
                <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <FormControlLabel
                        label="Requiere Servicios a la Nave"
                        sx={{ width: 'auto', marginLeft: '10px' }}
                        value={data?.requiereServicios}
                        control={
                            <Checkbox
                                name="requiereServicios"
                                checked={data?.requiereServicios || false}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                    handleChange(event, 'checkbox')
                                }
                            />
                        }
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextareaAutosize
                        placeholder="Escriba una nota"
                        minRows={3}
                        maxRows={10}
                        name="nota"
                        onChange={handleChange}
                        value={data?.nota}
                    />
                </Grid>
            </SectionFormAccordion>
        </>
    );
}

export default PatentShipOperations;
