import _ from 'lodash';
import { Grid } from '@mui/material';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import Acciones from '../../../../components/GestionPasavantes/components/Acciones';
import BackdropComponent from '../../../../components/Backdrop/BackdropComponent';
import BlockcahinValidator from '../../../../components/BlockchainValidator';
import DatosEmbarcacion from '../../../../components/GestionPasavantes/components/DatosEmbarcacion';
import DatosLiquidacion from '../../../../components/GestionPasavantes/components/DatosLiquidacion';
import DescargaPDF from '../../../../components/GestionPasavantes/components/DescargaPDF';
import Loading from '../../../../components/Loading';
import PasavanteGeneralData from './PasavanteGeneralData';
import PasavanteTripDetails from './PasavanteTripDetails';
import RenewalAlert from './RenewalAlert';
import ReviewNoteDrawer from './ReviewNoteDrawer';
import SectionBody from '../../../../components/SectionBody';
import SectionHeader from '../../../../components/SectionHeader';
import ShipDataDrawer from '../../../../components/GestionPasavantes/components/ShipDataDrawer';
import usePasavantes from '../hooks/usePasavantes';

function DetailContainer() {
    const {
        downloadingCertificate,
        downloadingPasavantePDF,
        handleDownloadPasavantePDF,
        ...props
    } = usePasavantes();
    const { isMobile } = useIsMobile();

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>Información del Viaje</SectionHeader.Title>
            </SectionHeader>
            <SectionBody>
                {(props?.loadingData || props?.fetchingData) && !props?.data ? (
                    <Loading size="medium" />
                ) : (
                    <Grid container spacing={2}>
                        <Grid
                            item
                            xs={12}
                            sx={{
                                display: 'flex',
                                justifyItems: 'center',
                                alignItems: 'center',
                                flexDirection: isMobile ? 'column-reverse' : 'row',
                                marginTop: 2
                            }}
                        >
                            <BlockcahinValidator data={props?.data} />
                        </Grid>
                        {props?.data?.estado === 'liquidado' && (
                            <DescargaPDF
                                handleDownload={handleDownloadPasavantePDF}
                                loading={downloadingPasavantePDF}
                            />
                        )}
                        <RenewalAlert giroData={props?.data} />

                        <Grid item xs={12}>
                            <DatosEmbarcacion {...props} />
                        </Grid>
                        <Grid item xs={12}>
                            <PasavanteGeneralData {...props} />
                        </Grid>
                        <Grid item xs={12}>
                            <PasavanteTripDetails {...props} />
                        </Grid>
                        <Grid item xs={12}>
                            <DatosLiquidacion {...props} />
                        </Grid>
                        {props?.data?.estado !== 'liquidado' && (
                            <Grid item xs={12} justifyContent="center" display="flex" mt={8}>
                                <Acciones {...props} />
                            </Grid>
                        )}
                    </Grid>
                )}
            </SectionBody>
            <ShipDataDrawer {...props} />
            <ReviewNoteDrawer {...props} />
            <BackdropComponent loading={downloadingCertificate} />
        </>
    );
}

export default DetailContainer;
