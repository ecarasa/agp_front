import { Grid } from '@mui/material';
import Acciones from '../../../../components/GestionPasavantes/components/Acciones';
import BackdropComponent from '../../../../components/Backdrop/BackdropComponent';
import DatosEmbarcacion from '../../../../components/GestionPasavantes/components/DatosEmbarcacion';
import DatosLiquidacion from '../../../../components/GestionPasavantes/components/DatosLiquidacion';
import DescargaPDF from '../../../../components/GestionPasavantes/components/DescargaPDF';
import GeneralData from './GeneralData';
import Loading from '../../../../components/Loading';
import SectionBody from '../../../../components/SectionBody';
import SectionHeader from '../../../../components/SectionHeader';
import ShipDataDrawer from '../../../../components/GestionPasavantes/components/ShipDataDrawer';
import usePatentPasavante from '../hooks/usePatentPasavante';

function DetailContainer() {
    const {
        downloadingCertificate,
        handleDownloadLiquidationPDF,
        downloadingPasavantePDF,
        ...props
    } = usePatentPasavante({
        filters: undefined
    });

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>Información de Patente</SectionHeader.Title>
            </SectionHeader>

            <SectionBody>
                {(props?.loadingPatent || props?.fetchingPatent) && !props?.data ? (
                    <Loading size="medium" />
                ) : (
                    <Grid container spacing={2}>
                        <DescargaPDF
                            handleDownload={handleDownloadLiquidationPDF}
                            loading={downloadingPasavantePDF}
                        />

                        {/* <JudicializedAlert data={props?.data} /> */}

                        <Grid item xs={12}>
                            <DatosEmbarcacion {...props} />
                        </Grid>
                        <Grid item xs={12}>
                            <GeneralData {...props} />
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
            <BackdropComponent loading={downloadingCertificate || downloadingPasavantePDF} />
        </>
    );
}

export default DetailContainer;
