import _ from 'lodash';
import { CERTIFICATE_STATES } from '../../../commons/States';
import { downloadBase64File, handleErrors } from '../../../utils/common';
import { enqueueSnackbar } from 'notistack';
import { showAlert } from '../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    useGetAnswersQuery,
    useLazyDownloadPatentPDFQuery,
    useLazyGetPatentQuery,
    usePostPatentAnswerMutation
} from '../../../services/patentsApi';

const AlertTitles: { [key: number]: string } = {
    17: 'Solicitud Cancelada',
    18: 'Solicitud Aprobada',
    19: 'Solicitud Denegada',
    20: 'Solicitud Rechazada'
};

function usePatentDetail() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [sectionData, setSectionData] = useState<any>(null);
    const [responseId, setResponseId] = useState<number | null>(null);
    const [responseNote, setResponseNote] = useState<string | null>(null);
    const [postAnswer, { isLoading: postingAnswer }] = usePostPatentAnswerMutation();
    const [downloadFile, { isLoading: downloadingPatentFile }] = useLazyDownloadPatentPDFQuery();

    const [getPatent, { isLoading: loadingPatent, isFetching: fetchingPatent }] =
        useLazyGetPatentQuery();
    const {
        data: availableAnswers,
        isLoading: loadingAnswers,
        isFetching: fetchingAnswers
    } = useGetAnswersQuery(id, { skip: !id, refetchOnMountOrArgChange: true });

    const handleChangeNote = (e: any) => setResponseNote(e?.target?.value);

    const loadData = async () => {
        try {
            const response: any = await getPatent(id);
            if (!response.error) setData(response?.data);
            else handleErrors(response.error);
        } catch (e) {}
    };

    const getShipCertificates = async () => {
        let certificateData: { [key: string]: any } = {};
        _.orderBy(data?.buque?.certificados, ['tipoCertificado.id', 'asc'])?.forEach((i: any) => {
            certificateData[i?.tipoCertificado?.nombre] = CERTIFICATE_STATES[i?.estado];
        });

        return certificateData;
    };

    const loadSectionData = async () => {
        const shipData = {
            'Nombre del buque': data?.buque?.nombre,
            'Tipo de embarcación': data?.buque?.tipoBuque?.nombre,
            'N° de IMO': data?.buque?.imo || 'N/A',
            'Señal distintiva': data?.buque?.senalDistintiva || '-',
            Bandera: data?.buque?.pais?.nombre,
            Matrícula: data?.buque?.matricula
        };

        const certificatesData = await getShipCertificates();

        setSectionData({
            ...sectionData,
            shipData: shipData,
            certificateData: certificatesData
        });
    };

    useEffect(() => {
        if (id && !data) loadData();
        if (data && !sectionData) loadSectionData();
        // eslint-disable-next-line
    }, [id, data]);

    const handleSubmit = async () => {
        try {
            const response: any = await postAnswer({
                patentId: id,
                responseId: responseId,
                body: {
                    nota: responseNote || null
                }
            });

            if (!response.error) {
                const title = AlertTitles[responseId!];
                dispatch(
                    showAlert({
                        title: title,
                        keepMounted: true,
                        confirmText: 'Cerrar',
                        confirmAction: () => navigate('/agp/patentes')
                    })
                );
            } else {
                enqueueSnackbar('Ocurrió un error.', { variant: 'error' });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleConfirmAction = (id: number) => {
        const ConfirmMessage: any = {
            17: 'Cancelar la solicitud de patente por AM',
            18: 'Aprobar solicitud de patente por AGP',
            19: 'Denegar solicitud de patente por AGP',
            20: 'Rechazar solicitud de patente por PNA'
        };

        dispatch(
            showAlert({
                title: ConfirmMessage[id],
                keepMounted: true,
                icon: 'info',
                confirmAction: setResponseId,
                itemData: id,
                confirmText: 'Continuar',
                cancelText: 'Cancelar'
            })
        );
    };

    const handleClose = () => setResponseId(null);

    const handleDownloadFile = async () => {
        try {
            const response: any = await downloadFile(id);
            if (!response?.error) {
                downloadBase64File(response?.data, Number(id), 'patente');
            } else {
                handleErrors(response?.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return {
        availableAnswers,
        data,
        downloadingPatentFile,
        fetchingAnswers,
        fetchingPatent,
        loadingAnswers,
        loadingPatent,
        postingAnswer,
        responseId,
        sectionData,
        handleChangeNote,
        handleClose,
        handleConfirmAction,
        handleDownloadFile,
        handleSubmit,
        setResponseId
    };
}

export default usePatentDetail;
