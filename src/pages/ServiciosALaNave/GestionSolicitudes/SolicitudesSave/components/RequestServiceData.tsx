import { Grid } from '@mui/material';
import AutocompleteComponent from '../../../../../components/layout/Autocomplete';
import Input from '../../../../../components/Input/Input';

function RequestServiceData(props: any) {
    const { data, services, loadingServices, handleChange } = props;
    return (
        <>
            <Grid item xs={12} md={6}>
                <AutocompleteComponent
                    value={data?.idServicio || null}
                    onChange={(value: any) =>
                        handleChange({
                            target: {
                                name: 'idServicio',
                                value: value
                            }
                        })
                    }
                    label="Servicio Solicitado"
                    name="idServicio"
                    options={services || []}
                    loading={loadingServices}
                    required
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Input
                    name="idGerencia"
                    value={data?.idServicio?.gerencia?.nombre || ''}
                    label="Gerencia"
                    readOnly
                />
            </Grid>
            <Grid item xs={12}>
                <AutocompleteComponent
                    value={data?.idPrestador || null}
                    onChange={(value: any) =>
                        handleChange({
                            target: {
                                name: 'idPrestador',
                                value: value
                            }
                        })
                    }
                    label="Empresa que brinde servicio"
                    name="idPrestador"
                    options={data?.idServicio?.prestadores || []}
                    loading={loadingServices}
                    readOnly={data?.idServicio?.prestadores?.length === 1}
                    required
                />
            </Grid>
            <Grid item xs={12} mt={4}>
                <Input name="nota" label="Nota" onChange={handleChange} value={data?.nota || ''} />
            </Grid>
        </>
    );
}

export default RequestServiceData;
