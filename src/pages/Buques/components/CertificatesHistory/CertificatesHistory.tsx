import _ from 'lodash';
import { getDateTime } from '../../../../utils/common';
import { Grid, Tooltip } from '@mui/material';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import CertificatesFilter from './components/CertificatesFilter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DataTable from '../../../../components/DataTable/DataTable';
import DownloadIcon from '@mui/icons-material/Download';
import Loading from '../../../../components/Loading';
import SectionHeader from '../../../../components/SectionHeader';
import useCertificatesHistory from './hooks/useCertificatesHistory';
import useGlobalFilters from '../../../../hooks/useGlobalFilters';

function CertificatesHistory() {
    const { filters, setFilters, debounceSearch, handleSubmitSearch, clearFilters } =
        useGlobalFilters();
    const {
        loadingShipData,
        shipData,
        fetchingShipData,
        parametricData,
        certificateId,
        certificateHistory,
        loadingCertificateHistory,
        fetchingCertificateHistory,
        downloadingFile,
        handleDownloadFile,
        handleChangeCertificate
    } = useCertificatesHistory({
        filters
    });
    const { isMobile } = useIsMobile();

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>Consulta Histórica de Certificados</SectionHeader.Title>
            </SectionHeader>

            <Grid
                container
                direction={isMobile ? 'column-reverse' : 'row'}
                justifyContent="center"
                alignItems="center"
                spacing={3}
                mb={2}
                sx={{
                    '& .MuiGrid-root': {
                        width: '100%'
                    }
                }}
            >
                <Grid
                    item
                    xs={12}
                    sx={{
                        fontSize: '26px',
                        '& span': {
                            display: 'inline-flex'
                        }
                    }}
                >
                    <span>
                        Buque:{' '}
                        {loadingShipData || fetchingShipData ? (
                            <Loading size="extrasmall" />
                        ) : (
                            shipData?.data?.nombre || 'N/A'
                        )}
                    </span>
                </Grid>
                <Grid item xs={12}>
                    <CertificatesFilter
                        handleChangeCertificate={handleChangeCertificate}
                        certificateId={certificateId}
                        parametricData={parametricData}
                    />
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="flex-start"
                spacing={3}
            >
                <Grid item xs={12}>
                    {certificateId && (
                        <DataTable
                            headers={[
                                {
                                    titles: ['Fecha de alta'],
                                    upperLabel: (item: any) => (
                                        <b>{getDateTime(item?.fechaAlta)}</b>
                                    ),
                                    width: 20
                                },
                                {
                                    upperLabel: (item: any) => (
                                        <>
                                            {item?.fechaEmision && (
                                                <>
                                                    <span>Fecha Emisión:&nbsp;</span>
                                                    <b>{getDateTime(item?.fechaEmision)}</b>
                                                </>
                                            )}
                                        </>
                                    ),
                                    lowerLabel: (item: any) => (
                                        <>
                                            {item?.fechaVencimiento && (
                                                <>
                                                    <span>Fecha Vencimiento:&nbsp;</span>
                                                    <b>{getDateTime(item?.fechaVencimiento)}</b>
                                                </>
                                            )}
                                        </>
                                    ),
                                    noStyle: true,
                                    width: 20
                                },
                                {
                                    upperLabel: (item: any) => (
                                        <>
                                            {item?.numero && (
                                                <>
                                                    <span>Número:&nbsp;</span>
                                                    <b>{item?.numero}</b>
                                                </>
                                            )}
                                        </>
                                    ),
                                    lowerLabel: (item: any) => (
                                        <>
                                            {item?.puntaje && (
                                                <>
                                                    <span>Puntaje:&nbsp;</span>
                                                    <b>{item?.puntaje}</b>
                                                </>
                                            )}
                                        </>
                                    ),
                                    noStyle: true,
                                    width: 20
                                },
                                {
                                    upperLabel: (item: any) => (
                                        <>
                                            {item?.vigente && (
                                                <span
                                                    style={{
                                                        alignItems: 'center',
                                                        display: 'flex',
                                                        color: '#6EBE64'
                                                    }}
                                                >
                                                    Vigente&nbsp;
                                                    <CheckCircleIcon
                                                        sx={{ color: '#6EBE64' }}
                                                        fontSize="small"
                                                    />
                                                </span>
                                            )}
                                        </>
                                    ),
                                    width: 20
                                },
                                {
                                    type: 'action',
                                    icon: (
                                        <Tooltip title="Descargar">
                                            <DownloadIcon />
                                        </Tooltip>
                                    ),
                                    onClick: handleDownloadFile
                                }
                            ]}
                            onSelectRow={() => {
                                return;
                            }}
                            filters={filters}
                            setFilters={setFilters}
                            items={certificateHistory}
                            isLoading={loadingCertificateHistory}
                            isFetching={fetchingCertificateHistory}
                        />
                    )}
                </Grid>
            </Grid>
            {downloadingFile && <Loading size="small" />}
        </>
    );
}

export default CertificatesHistory;
