import { Grid } from '@mui/material';
import Input from '../../../../../components/Input/Input';
import VirtualizedAutocomplete from '../../../../../components/VirtualizedAutocomplete';

function LoaderDataForm(props: any) {
    const { data, companies, loadingCompanies, handleChangeData } = props;
    return (
        <>
            <Grid item xs={12} sm={6}>
                <VirtualizedAutocomplete
                    value={data?.idCargador || ''}
                    templateLabel={(option: any) => `${option.id} - ${option.nombre}`}
                    onChange={(value: any) =>
                        handleChangeData({
                            target: {
                                name: 'idCargador',
                                value: value
                            }
                        })
                    }
                    options={companies || []}
                    loading={loadingCompanies}
                    label="Razon Social"
                    name="idCargador"
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Input
                    readOnly
                    value={data?.idCargador ? data?.idCargador?.identificacionFiscal || 'N/A' : ''}
                    name="identificacionFiscal"
                    label="CUIT"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Input
                    readOnly
                    value={
                        data?.idCargador
                            ? data?.idCargador?.ciudad
                                ? `${data?.idCargador?.ciudad?.nombre} - ${data?.idCargador?.ciudad?.pais?.nombre}`
                                : 'N/A'
                            : ''
                    }
                    name="ciudadCargador"
                    label="Localidad"
                />
            </Grid>
        </>
    );
}

export default LoaderDataForm;
