import _ from 'lodash';
import { Box, Grid } from '@mui/material';
import { SHIP_STATES } from '../../../commons/States';
import { stateIcons } from '../BuquesIndex';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AddCertificateDrawer from './components/AddCertificateDrawer';
import Button from '../../../components/button/Button';
import ButtonActions from '../../../components/ButtonActions';
import CertificatesTable from './components/CertificatesTable';
import Loading from '../../../components/Loading';
import SectionHeader from '../../../components/SectionHeader';
import useCertificates from './hooks/useCertificates';

function BuquesCertificates() {
    const { t } = useTranslation('userForm');
    const {
        shipData,
        isLoading,
        parametrics,
        loadedFiles,
        loadDataError,
        uploadingFile,
        handleDeleteCertificate,
        assignButtonState,
        handleViewDoc,
        setOpenDrawer,
        handleSubmit,
        assigningCertificates,
        loadingShipData,
        ...props
    } = useCertificates();
    const { isMobile } = useIsMobile();
    const navigate = useNavigate();

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>{t('buquesCertificates.title')}</SectionHeader.Title>
            </SectionHeader>
            <Box justifyContent="center" sx={{ padding: { sm: 0, md: '0 65px' } }}>
                <Grid container>
                    <Grid container alignItems="baseline" justifyContent="space-between">
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}
                        >
                            Buque:{' '}
                            {loadingShipData ? (
                                <Loading size="extrasmall" />
                            ) : (
                                <>
                                    <b>{shipData?.nombre}</b> - {stateIcons(shipData?.estado)}
                                    {SHIP_STATES[shipData?.estado]}
                                </>
                            )}
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            mt={isMobile ? 3 : 0}
                            component="form"
                            sx={{ textAlign: 'right' }}
                        >
                            <ButtonActions
                                position={isMobile ? 'left' : 'right'}
                                onClick={() => setOpenDrawer(true)}
                                confirmText="Agregar certificado"
                            />
                        </Grid>
                    </Grid>
                    <Grid container mt={5}>
                        <CertificatesTable
                            parametrics={parametrics}
                            handleViewDoc={handleViewDoc}
                            isLoading={isLoading}
                            loadedFiles={loadedFiles}
                            uploadingFile={uploadingFile}
                            handleDeleteCertificate={handleDeleteCertificate}
                            shipData={shipData}
                        />
                    </Grid>
                    <Grid
                        container
                        m={5}
                        textAlign="center"
                        justifyContent="center"
                        alignItems="center"
                        gap={2}
                    >
                        <Grid item xs={12} mt={5} component="div">
                            {shipData?.estado === 'BO' && (
                                <Button
                                    loading={assigningCertificates}
                                    onClick={handleSubmit}
                                    disabled={
                                        assignButtonState() ||
                                        (!isLoading && _.isEmpty(parametrics))
                                    }
                                >
                                    {t('buquesCertificates.assignCertificate')}
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            <AddCertificateDrawer
                shipData={shipData}
                setOpenDrawer={setOpenDrawer}
                loadedFiles={loadedFiles}
                parametrics={parametrics}
                isLoading={isLoading}
                uploadingFile={uploadingFile}
                {...props}
            />
        </>
    );
}

export default BuquesCertificates;
