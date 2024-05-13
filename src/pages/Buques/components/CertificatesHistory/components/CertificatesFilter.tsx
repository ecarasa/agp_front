import _ from 'lodash';
import { FormControl, InputLabel, MenuItem, Select, Toolbar } from '@mui/material';

function CertificatesFilter({ parametricData, certificateId, handleChangeCertificate }: any) {
    return (
        <Toolbar
            sx={{
                background: '#FFFFFF',
                boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.25)',
                borderRadius: '16px'
            }}
        >
            <FormControl fullWidth variant="outlined" sx={{ width: '250px' }} size="small">
                <InputLabel id="demo-simple-select-label">Tipo de certificado</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={certificateId}
                    label="Tipo de certificado"
                    name="certificateId"
                    size="small"
                    onChange={handleChangeCertificate}
                >
                    <MenuItem value={''}>Seleccionar certificado</MenuItem>
                    {_.orderBy(parametricData?.tiposCertificado, ['obligatorio'], ['desc'])?.map(
                        (item: any) => (
                            <MenuItem key={item.id} value={item?.id}>
                                {`${item.nombre}${item.obligatorio ? '*' : ''}`}
                            </MenuItem>
                        )
                    )}
                </Select>
            </FormControl>
        </Toolbar>
    );
}

export default CertificatesFilter;
