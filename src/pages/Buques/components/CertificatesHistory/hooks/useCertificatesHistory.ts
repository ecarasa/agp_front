import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { downloadFile, handleErrors } from '../../../../../utils/common';
import { FILE_EXTENSION } from '../../../../../constants/regex';
import {
    useGetBuqueByIdQuery,
    useGetParametricDataQuery,
    useGetShipCertificatesHistoryQuery,
    useLazyDownloadCertificateQuery
} from '../../../../../services/shipsApi';

function useCertificatesHistory({ filters }: any) {
    const { id } = useParams();
    const [downloadingFile, setDownloadingFile] = useState<boolean>(false);
    const [certificateId, setCertificateId] = useState<any>('');
    const [downloadCertificate] = useLazyDownloadCertificateQuery();
    const { data: parametricData, isLoading: loadingParametricData } = useGetParametricDataQuery(
        {}
    );
    const {
        data: shipData,
        isLoading: loadingShipData,
        isFetching: fetchingShipData
    } = useGetBuqueByIdQuery(id);

    const {
        data: certificateHistory,
        isLoading: loadingCertificateHistory,
        isFetching: fetchingCertificateHistory
    } = useGetShipCertificatesHistoryQuery(
        {
            shipId: id,
            certificateId: certificateId,
            filters
        },
        { skip: !certificateId, refetchOnMountOrArgChange: true }
    );

    const handleChangeCertificate = (e: any) => {
        const { value } = e?.target;
        if (!value) return setCertificateId('');
        setCertificateId(value);
    };

    const handleDownloadFile = async (e: any, item: any) => {
        try {
            setDownloadingFile(true);
            const response: any = await downloadCertificate({
                idBuque: id,
                idCertificate: item?.id
            });

            if (!response?.error) {
                const certificateType = parametricData?.tiposCertificado.find(
                    (i: any) => i.id === certificateId
                );
                await fetch(response?.data?.presignedUrl)
                    .then((response) => response.blob())
                    .then((blob) => {
                        const name = `${shipData?.data?.nombre
                            ?.replace(/ /g, '-')
                            .toLowerCase()}-${certificateType?.nombre
                            .replace(/ /g, '-')
                            .toLowerCase()}${item?.rutaAdjunto.match(FILE_EXTENSION)[0]}`;
                        downloadFile({ blob, name });
                    })
                    .catch((error) => {
                        enqueueSnackbar('Ocurrió un problema', {
                            variant: 'error'
                        });
                    });
            } else {
                handleErrors(response?.error);
            }
        } catch (e: any) {
            enqueueSnackbar(e?.error?.data?.message || 'Ocurrió un problema', {
                variant: 'error'
            });
        } finally {
            setDownloadingFile(false);
        }
    };

    return {
        shipData,
        certificateId,
        downloadingFile,
        parametricData,
        loadingShipData,
        fetchingShipData,
        certificateHistory,
        loadingParametricData,
        loadingCertificateHistory,
        fetchingCertificateHistory,
        handleDownloadFile,
        handleChangeCertificate
    };
}

export default useCertificatesHistory;
