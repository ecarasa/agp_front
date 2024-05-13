import { Box, Grid, Link, Paper, Tooltip } from '@mui/material';
import { getCertificatesStates } from '../../../utils/functions';

function DatosEmbarcacion(props: any) {
    const { data, handleOpenDrawer, handleDownloadCertificate } = props;

    return (
        <Box>
            <p>Datos de la Embarcación</p>
            <Paper sx={{ border: '1px solid #D9D9D9', borderRadius: '12px' }}>
                <Grid container spacing={2} p={2} sx={{ fontSize: 16 }}>
                    <Grid item xs={12} md={6}>
                        <Grid
                            container
                            spacing={2}
                            p={2}
                            sx={{
                                '& .MuiGrid-item': {
                                    paddingTop: '8px'
                                },
                                '& .MuiGrid-item.text-strong': {
                                    fontWeight: 800,
                                    textAlign: 'right'
                                }
                            }}
                        >
                            <Grid item xs={6}>
                                Agencia:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {data?.agencia?.nombre}
                            </Grid>
                            <Grid item xs={6}>
                                CUIT:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {data?.CUIT || 'N/A'}
                            </Grid>
                            <Grid item xs={6}>
                                Nombre Embarcación:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {data?.buque?.nombre}
                            </Grid>
                            <Grid item xs={6}>
                                Tipo Embarcación:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {data?.buque?.tipoBuque?.nombre}
                            </Grid>
                            <Grid item xs={6}>
                                IMO:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {data?.buque?.imo || 'N/A'}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Grid
                            container
                            spacing={2}
                            p={2}
                            sx={{
                                '& .MuiGrid-item': {
                                    paddingTop: '8px'
                                },
                                '& .MuiGrid-item.text-strong': {
                                    fontWeight: 800,
                                    textAlign: 'right'
                                }
                            }}
                        >
                            <Grid item xs={6}>
                                Matricula:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {data?.buque?.matricula}
                            </Grid>
                            <Grid item xs={6}>
                                Bandera:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {`${data?.buque?.pais?.nombre} ${
                                    data?.buque?.pais?.isoCode
                                        ? `(${data?.buque?.pais?.isoCode})`
                                        : ''
                                }`}
                            </Grid>
                            <Grid item xs={6}>
                                TRN:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {data?.buque?.trn}
                            </Grid>
                            <Grid item xs={6}>
                                ESI:
                            </Grid>
                            <Grid item xs={6} className="text-strong">
                                {data?.esi || 'N/A'}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} sx={{ display: 'flex', aligItems: 'center' }}>
                        <p>Certificados subidos:</p>
                    </Grid>
                    <Grid item xs={6} justifyContent="right" display="flex">
                        <p className="text-link" onClick={() => handleOpenDrawer()}>
                            Más Datos
                        </p>
                    </Grid>
                    {data?.buque?.certificados?.map((item: any) => (
                        <Grid item xs={12} md={6} lg={4} key={item?.id}>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    {!!item?.rutaAdjunto ? (
                                        <Tooltip placement="top-end" title="Descargar">
                                            <Link
                                                sx={{
                                                    fontWeight: 500,
                                                    cursor: 'pointer',
                                                    color: 'var(--black)'
                                                }}
                                                onClick={() =>
                                                    handleDownloadCertificate({
                                                        certificado: item,
                                                        buque: {
                                                            id: data?.buque?.id,
                                                            nombre: data?.buque?.nombre
                                                        }
                                                    })
                                                }
                                                underline="hover"
                                            >
                                                {item?.tipoCertificado?.nombre}
                                            </Link>
                                        </Tooltip>
                                    ) : (
                                        <Link
                                            sx={{
                                                fontWeight: 500,
                                                color: 'var(--black)',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            {item?.tipoCertificado?.nombre}
                                        </Link>
                                    )}
                                </Grid>
                                <Grid
                                    item
                                    xs={4}
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    display="flex"
                                >
                                    {getCertificatesStates(item?.estado)}
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
}

export default DatosEmbarcacion;
