import { Box, Button, Grid, Paper, Tooltip } from '@mui/material';
import { getDateTime } from '../../../utils/common';
import { INTEGERS_OR_TWO_DECIMALS } from '../../../constants/regex';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import Input from '../../Input/Input';
import Loading from '../../Loading';
import UploadIcon from '@mui/icons-material/Upload';

function DatosLiquidacion(props: any) {
    const { data, handleChange, billing, confirmAction, downloadingAttachedFile } = props;
    const liquidado = data?.estado?.toLowerCase() === 'liquidado';

    return (
        <Box>
            <p>Datos de liquidación</p>

            <Paper sx={{ border: '1px solid #D9D9D9', borderRadius: '12px' }}>
                <Grid container spacing={2} p={4} sx={{ fontSize: 16 }}>
                    <Grid item xs={12} mb={1} mt={1}>
                        Fecha envío a liquidación:&nbsp;
                        <b>
                            {getDateTime(
                                data?.fechaEnvioLiquidacion || billing?.fechaEnvioLiquidacion
                            ) || 'N/A'}
                        </b>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Input
                                    label="Adjuntar PDF"
                                    size="small"
                                    name="file"
                                    readOnly
                                    value={billing?.file?.name || billing?.docFactura || ''}
                                />
                                {billing?.docFactura && (
                                    <Tooltip title="Descargar PDF Adjunto" placement="top">
                                        <DownloadIcon
                                            sx={{
                                                marginLeft: '8px',
                                                cursor: 'pointer',
                                                color: 'var(--primary)'
                                            }}
                                            onClick={() => confirmAction('descargar_adjunto')}
                                        />
                                    </Tooltip>
                                )}
                                {downloadingAttachedFile && <Loading size="extrasmall" />}
                            </Grid>
                            <Grid item xs={12} mb={1}>
                                <Button
                                    disabled={liquidado}
                                    variant="outlined"
                                    component="label"
                                    startIcon={<UploadIcon />}
                                    color="inherit"
                                    className="btn-add-file"
                                >
                                    Adjuntar Documento
                                    <input name="file" type="file" hidden onChange={handleChange} />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Input
                            readOnly={liquidado || !billing?.file}
                            label="Número de factura"
                            name="nroFactura"
                            size="small"
                            value={billing?.nroFactura || ''}
                            onChange={(e: any) => {
                                if (e?.target?.value?.length < 16) {
                                    handleChange(e);
                                }
                            }}
                            endIcon={!liquidado && !!billing?.file ? <EditIcon /> : null}
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Input
                            readOnly={liquidado}
                            label="Cotización dolar"
                            size="small"
                            name="cotizacionDolar"
                            value={billing?.cotizacionDolar || ''}
                            onChange={(event: any) => {
                                const { value } = event?.target;
                                if (
                                    (value?.length < 9 &&
                                        INTEGERS_OR_TWO_DECIMALS.test(event.target.value)) ||
                                    value === ''
                                ) {
                                    handleChange(event);
                                }
                            }}
                            endIcon={!liquidado ? <EditIcon /> : null}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            readOnly={liquidado}
                            label="Nota de liquidación"
                            size="small"
                            value={billing?.notaLiquidacion || ''}
                            name="notaLiquidacion"
                            onChange={handleChange}
                            endIcon={!liquidado ? <EditIcon /> : null}
                        />
                    </Grid>
                    {/* {props?.data?.estado === 'liquidado' && (
                        <SettlementInformation billing={billing} />
                    )} */}
                </Grid>
            </Paper>
        </Box>
    );
}

export default DatosLiquidacion;
