import { Box, Button, CircularProgress } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';

import { downloadBase64File, handleErrors } from '../utils/common';
import {
    useLazyGetBlkDataQuery,
    useValidateBlkDataMutation,
    useLazyDowloadBlkPdfQuery
} from '../services/girosApi';

import { showAlert } from '../features/slices/applicationSlice';
import { useAppDispatch } from '../hooks/reduxHooks';
import { useIsMobile } from '../hooks/useIsMobile';
import Loading from './Loading';

type Prop = {
    data: { id: string; estado: string };
};
interface IBlkResponse {
    id: string;
    fecha: string;
    txId: string;
    urlBlokchain: string;
}
export enum BlkStatusEnum {
    INIT = 'init',
    VALID = 'valid',
    NOT_VALID = 'not_valid',
    ERROR = 'error'
}

const BlockcahinValidator: FC<Prop> = ({ data }) => {
    const { t } = useTranslation('userForm');
    const dispatch = useAppDispatch();
    const { isMobile, isTablet } = useIsMobile();

    const [getBlkDataById, { isLoading, isFetching }] = useLazyGetBlkDataQuery();
    const [getBlkPDF, { isFetching: isFetchingPdf }] = useLazyDowloadBlkPdfQuery();
    const [validateBlkData, { isLoading: isValidating }] = useValidateBlkDataMutation();

    const loading = isLoading || isFetching || isValidating;

    const [display, setDisplay] = useState<boolean>(false);
    const [disableBtn, setDisableBtn] = useState<boolean>(true);
    const [blkData, setBlkData] = useState<IBlkResponse | null>(null);
    const [blkStatus, setBlkStatus] = useState<BlkStatusEnum>(BlkStatusEnum.INIT);

    const loadData = async () => {
        try {
            const response = await getBlkDataById({
                tabla: 'giros',
                idTabla: data?.id,
                estado: data?.estado
            });
            if (!response?.error) {
                setDisplay(true);
                setBlkData(response?.data.data);
                await handleValidate(response?.data.data);
            } else {
                setDisplay(true);
            }
        } catch (e: any) {
            setDisplay(true);
            handleErrors(e?.message);
        }
    };

    useEffect(() => {
        if (data) loadData();
        // eslint-disable-next-line
    }, [data]);

    const handleValidate = async (blkResponse: IBlkResponse | null, showModal = false) => {
        if (!blkResponse?.txId?.length) return;

        const body = { txId: blkResponse?.txId };
        const validationResponse: any = await validateBlkData({ body, idGiro: data?.id });

        if (!validationResponse?.error) {
            setDisableBtn(false);
            const { data } = validationResponse.data;
            if (data.esValido) {
                setBlkStatus(BlkStatusEnum.VALID);
                if (showModal) {
                    dispatch(
                        showAlert({
                            title: t('blockchain.blk-status-checked-ok'),
                            keepMounted: true,
                            confirmText: t('blockchain.blk-close'),
                            itemData: -1
                        })
                    );
                }
            } else {
                setBlkStatus(BlkStatusEnum.NOT_VALID);
                if (showModal) {
                    dispatch(
                        showAlert({
                            title: t('blockchain.blk-status-checked-not-valid'),
                            confirmText: t('blockchain.blk-close'),
                            icon: 'cancel'
                        })
                    );
                }
            }
        } else {
            setBlkStatus(BlkStatusEnum.ERROR);
            dispatch(
                showAlert({
                    title: t('blockchain.blk-error'),
                    message: t('blockchain.blk-status-error'),
                    confirmText: t('blockchain.blk-close'),
                    icon: 'cancel'
                })
            );
        }
    };

    const navigateToUrl = () => {
        if (blkData && blkData.urlBlokchain)
            window.open(`${blkData.urlBlokchain}`, '_blank', 'rel=noopener noreferrer');
    };

    const handleDownloadFile = async () => {
        try {
            if (blkData && blkData.txId) {
                const response: any = await getBlkPDF(blkData?.txId);
                if (!response?.error) {
                    downloadBase64File(
                        response?.data,
                        Math.floor(Math.random() * 9) + 1,
                        blkData?.txId || 'blockchain_data'
                    );
                } else {
                    handleErrors(response?.error);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {!display && (
                <>
                    <Loading size="small" /> {!isMobile && t('blockchain.blk-verifying')}
                </>
            )}
            {display && (
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyItems: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        marginTop: isMobile ? 2 : 0,
                        paddingX: isMobile ? 2 : 0
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            gap: isMobile ? 1 : 12,
                            display: 'flex',
                            justifyItems: 'center',
                            alignItems: 'center',
                            flexDirection: isTablet ? 'column' : 'row',
                            marginTop: isMobile ? 2 : 0,
                            paddingX: isMobile ? 2 : 0
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 0,
                                justifyItems: 'center',
                                alignItems: 'center',
                                marginTop: isMobile ? 2 : 0,
                                paddingX: 0
                            }}
                        >
                            <Button
                                aria-label="action_button_blockchain"
                                sx={{
                                    m: 1,
                                    borderRadius: '20px',
                                    boxShadow: 1,
                                    border: 'solid 1px',
                                    fontSize: isTablet ? '12px' : '14px',
                                    height: '32px',
                                    width: 'auto',
                                    minWidth: 'fit-content'
                                }}
                                disabled={disableBtn}
                                variant="outlined"
                                onClick={navigateToUrl}
                            >
                                {t('blockchain.blk-caption')}
                            </Button>

                            <Button
                                sx={{
                                    m: 1,
                                    borderRadius: '20px',
                                    boxShadow: 1,
                                    border: 'solid 1px',
                                    fontSize: isTablet ? '12px' : '14px',
                                    height: '32px',
                                    width: isMobile ? '52px' : '100%',
                                    padding: '7px',
                                    minWidth: 'fit-content'
                                }}
                                disabled={disableBtn}
                                variant="outlined"
                                onClick={handleDownloadFile}
                            >
                                {isFetchingPdf ? (
                                    <CircularProgress
                                        style={{ margin: '0 10px' }}
                                        color="inherit"
                                        size="1.2em"
                                    />
                                ) : (
                                    <DownloadIcon />
                                )}
                                {t('blockchain.blk-dowload-pdf-caption')}
                            </Button>
                        </Box>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: isMobile || isTablet ? 'center' : 'start',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: '14px',
                                width: '70%'
                            }}
                            onClick={() => handleValidate(blkData, true)}
                        >
                            {loading ? (
                                <CircularProgress
                                    style={{ margin: '0 10px' }}
                                    color="inherit"
                                    size="1.2em"
                                />
                            ) : (
                                <>
                                    {blkStatus === BlkStatusEnum.INIT && (
                                        <InfoIcon sx={{ color: '#3761ED' }} fontSize="medium" />
                                    )}
                                    {blkStatus === BlkStatusEnum.VALID && (
                                        <CheckCircleIcon
                                            sx={{ color: '#6EBE64' }}
                                            fontSize="medium"
                                        />
                                    )}
                                    {blkStatus === BlkStatusEnum.NOT_VALID && (
                                        <InfoIcon sx={{ color: '#D40000' }} fontSize="medium" />
                                    )}
                                    {blkStatus === BlkStatusEnum.ERROR && (
                                        <CancelIcon sx={{ color: '#D40000' }} fontSize="medium" />
                                    )}
                                </>
                            )}
                            <span>
                                {blkStatus === BlkStatusEnum.INIT
                                    ? t('blockchain.blk-status')
                                    : blkStatus === BlkStatusEnum.VALID
                                    ? t('blockchain.blk-status-ok')
                                    : blkStatus === BlkStatusEnum.NOT_VALID
                                    ? t('blockchain.blk-status-checked-not-valid')
                                    : t('blockchain.blk-status-checked-not-valid')}
                            </span>
                        </div>
                    </Box>
                    <Box sx={{ fontSize: isMobile ? '9px' : '14px', marginTop: 2 }}>
                        <strong>{blkData?.txId}</strong>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default BlockcahinValidator;
