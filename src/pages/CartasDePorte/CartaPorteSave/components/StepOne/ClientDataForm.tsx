import { Grid } from '@mui/material';
import Button from '../../../../../components/button/Button';
import Input from '../../../../../components/Input/Input';
import VirtualizedAutocomplete from '../../../../../components/VirtualizedAutocomplete';

function ClientDataForm(props: any) {
    const { data, companies, loadingCompanies, handleChangeData } = props;

    return (
        <>
            <Grid item xs={12} sm={6}>
                <VirtualizedAutocomplete
                    value={data?.idCliente || ''}
                    templateLabel={(option: any) => `${option.id} - ${option.nombre}`}
                    onChange={(value: any) =>
                        handleChangeData({
                            target: {
                                name: 'idCliente',
                                value: value
                            }
                        })
                    }
                    options={companies || []}
                    loading={loadingCompanies}
                    label="Razon Social"
                    name="idCliente"
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Input
                    readOnly
                    value={data?.idCliente ? data?.idCliente?.identificacionFiscal || 'N/A' : ''}
                    name="identificacionFiscal"
                    label="CUIT"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Input
                    readOnly
                    value={
                        data?.idCliente
                            ? data?.idCliente?.ciudad
                                ? `${data?.idCliente?.ciudad?.nombre} - ${data?.idCliente?.ciudad?.pais?.nombre}`
                                : 'N/A'
                            : ''
                    }
                    name="ciudadCliente"
                    label="Localidad"
                />
            </Grid>
            <Grid item xs={12} sm={6} className="flex-align-center">
                <Button
                    disabled={!data?.idCliente}
                    type="outlined"
                    onClick={() =>
                        handleChangeData({
                            target: {
                                name: 'object',
                                value: {
                                    idCargador: data?.idCliente,
                                    idConsignatario: data?.idCliente
                                }
                            }
                        })
                    }
                >
                    Completar formulario
                </Button>
            </Grid>
        </>
    );
}

export default ClientDataForm;
