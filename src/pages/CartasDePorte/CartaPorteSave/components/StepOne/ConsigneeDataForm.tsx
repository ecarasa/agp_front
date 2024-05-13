import { Grid } from '@mui/material';
import Input from '../../../../../components/Input/Input';
import VirtualizedAutocomplete from '../../../../../components/VirtualizedAutocomplete';

function ConsigneeDataForm(props: any) {
    const { data, companies, loadingCompanies, handleChangeData } = props;
    return (
        <>
            <Grid item xs={12} sm={6}>
                <VirtualizedAutocomplete
                    value={data?.idConsignatario || ''}
                    templateLabel={(option: any) => `${option.id} - ${option.nombre}`}
                    onChange={(value: any) =>
                        handleChangeData({
                            target: {
                                name: 'idConsignatario',
                                value: value
                            }
                        })
                    }
                    options={companies || []}
                    loading={loadingCompanies}
                    label="Razon Social"
                    name="idConsignatario"
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Input
                    readOnly
                    value={
                        data?.idConsignatario
                            ? data?.idConsignatario?.identificacionFiscal || 'N/A'
                            : ''
                    }
                    name="identificacionFiscal"
                    label="CUIT"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Input
                    readOnly
                    value={
                        data?.idConsignatario
                            ? data?.idConsignatario?.ciudad
                                ? `${data?.idConsignatario?.ciudad?.nombre} - ${data?.idConsignatario?.ciudad?.pais?.nombre}`
                                : 'N/A'
                            : ''
                    }
                    name="ciudadConsignatario"
                    label="Localidad"
                />
            </Grid>
            <Grid item xs={12}>
                <Input
                    label="Nota"
                    value={data?.nota || ''}
                    onChange={handleChangeData}
                    name="nota"
                />
            </Grid>
        </>
    );
}

export default ConsigneeDataForm;
