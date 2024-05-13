import { downloadFile } from '../../../utils/common';
import { enqueueSnackbar } from 'notistack';
import { FILE_EXTENSION } from '../../../constants/regex';
import { useLazyDownloadCertificateQuery } from '../../../services/shipsApi';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

function useGlobalPasavantes() {
    const location = useLocation();
    const isDocking = location?.pathname?.includes('giros');
    const [openShipDrawer, setOpenShipDrawer] = useState<boolean>(false);
    const [downloadCertificate, { isLoading: downloading, isFetching: fetching }] =
        useLazyDownloadCertificateQuery();

    const handleOpenDrawer = () => {
        setOpenShipDrawer(true);
    };

    const handleCloseDrawer = () => {
        setOpenShipDrawer(false);
    };

    const handleDownloadCertificate = async (data: any) => {
        try {
            const response: any = await downloadCertificate({
                idBuque: data?.buque?.id,
                idCertificate: data?.certificado?.id
            });

            await fetch(response?.data?.presignedUrl)
                .then((response) => response.blob())
                .then((blob) => {
                    const name = `${
                        data?.buque?.nombre
                    }-${data?.certificado?.tipoCertificado?.nombre
                        .replace(/ /g, '-')
                        .toLowerCase()}${data?.certificado?.rutaAdjunto.match(FILE_EXTENSION)[0]}`;
                    downloadFile({ blob, name });
                })
                .catch((error) => {
                    enqueueSnackbar('Ocurrió un problema', {
                        variant: 'error'
                    });
                });
        } catch (e: any) {
            enqueueSnackbar(e?.error?.data?.message || 'Ocurrió un problema', { variant: 'error' });
        }
    };

    const getRateCode = (option: any) => {
        const value = option?.codigo + ' - ' + option?.descripcion;

        let optionalValue: string = '';

        if (option?.terminal) optionalValue = ' - ' + option?.terminal?.nombre;
        if (option?.tipoTrafico)
            optionalValue = optionalValue + ' - ' + option?.tipoTrafico?.nombre;

        return value + optionalValue;
    };

    const downloadingCertificate = downloading || fetching;

    return {
        openShipDrawer,
        isDocking,
        downloadingCertificate,
        handleDownloadCertificate,
        handleOpenDrawer,
        handleCloseDrawer,
        getRateCode
    };
}

export default useGlobalPasavantes;
