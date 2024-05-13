import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Box, Grid, Checkbox } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { handleErrors } from '../../../utils/common';
import {
    selectCurrentCommunication,
    setStorageLoading
} from '../../../features/slices/applicationSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import ButtonActions from '../../../components/ButtonActions';
import Input from '../../../components/Input/Input';
import SectionHeader from '../../../components/SectionHeader';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommunicationModal from './Modal';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';

import { useIsMobile } from '../../../hooks/useIsMobile';
import { useEditComunicacionCertificadoMutation } from '../../../services/companyApi';
import { useNavigate } from 'react-router-dom';
import SectionFormAccordion from '../../../components/SectionFormAccordion/SectionFormAccordion';

const ComunicacionesDataForm = () => {
    const { t } = useTranslation('communications');

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { isMobile } = useIsMobile();

    const commData: any = useAppSelector(selectCurrentCommunication);

    const [editComunicacionData, { isLoading: editCom }] = useEditComunicacionCertificadoMutation();
    const [modifiedValues, setModifiedValues] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);
    const [type, setType] = useState<string>('short');

    const handleChange = (e: any) => {
        let { name, value } = e?.target;
        if (value === commData[name]) {
            let newObject = { ...modifiedValues };
            if (newObject[name]) delete newObject[name];
            setModifiedValues(newObject);
        } else {
            setModifiedValues({ ...modifiedValues, [name]: value });
        }
        setData({ ...data, [name]: value });
    };

    const switchHandler = (event: any) => {
        setModifiedValues({ ...modifiedValues, activo: event.target.checked });
        setData({ ...data, activo: event.target.checked });
    };

    const handleOpenModal = (typeData: string) => {
        setModalOpen(true);
        setType(typeData);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const body = {
            titulo: modifiedValues.titulo,
            mensaje: modifiedValues.mensaje,
            mensajeCorto: modifiedValues.mensajeCorto,
            aviso: modifiedValues?.aviso ? Number(modifiedValues.aviso) : undefined,
            email: modifiedValues?.mail,
            push: modifiedValues?.push,
            notificacion: modifiedValues?.notificacion,
            activo: modifiedValues.activo
        };

        try {
            dispatch(setStorageLoading(true));
            const response: any = await editComunicacionData({ body, idCertificado: data.id });
            if (response?.error) {
                handleErrors(response.error);
            } else {
                enqueueSnackbar('Editado exitosamente!', { variant: 'success' });
                dispatch(setStorageLoading(false));
                navigate(-1);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!data) setData(commData);
    }, [data, commData]);

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>{t('updateTitle')}</SectionHeader.Title>
            </SectionHeader>

            <Box
                component="form"
                sx={{ padding: { sm: 0, md: '0 65px' } }}
                justifyContent="center"
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <SectionFormAccordion title={t('messageText')}>
                    <Grid item xs={12}>
                        <Grid
                            container
                            spacing={3}
                            mb={2}
                            columnSpacing={{ xs: 12, sm: 6, lg: 24 }}
                        >
                            <Grid item xs={12} sm={6}>
                                <Typography sx={{ mt: 1 }}>
                                    {data?.tipoCertificado?.nombre || ''}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <>
                                    {t('status')}
                                    <Switch
                                        checked={data?.activo || false}
                                        onChange={switchHandler}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                        color="primary"
                                    />
                                </>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            label="Título"
                            name="titulo"
                            value={data?.titulo || ''}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Mensaje"
                            name="mensaje"
                            value={data?.mensaje || ''}
                            minRows={3}
                            maxRows={6}
                            variant="outlined"
                            required
                            multiline
                            fullWidth={true}
                            onChange={handleChange}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                            <div onClick={() => handleOpenModal('long')}>
                                <VisibilityIcon fontSize="small" />
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Mensaje Corto"
                            name="mensajeCorto"
                            value={data?.mensajeCorto || ''}
                            minRows={3}
                            maxRows={6}
                            variant="outlined"
                            required
                            multiline
                            fullWidth={true}
                            onChange={handleChange}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                            <div onClick={() => handleOpenModal('short')}>
                                <VisibilityIcon fontSize="small" />
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12}></Grid>
                </SectionFormAccordion>
                <SectionFormAccordion title={t('warning')}>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                borderRadius: 2,
                                border: '1px solid #9E9E9E',
                                paddingX: isMobile ? 1 : 4,
                                paddingY: 1,
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                justifyContent: 'center'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    paddingLeft: isMobile ? 3 : 0,
                                    alignItems: isMobile ? 'start' : 'center',
                                    flexDirection: isMobile ? 'column' : 'row',
                                    gap: isMobile ? 1 : 10
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Typography>Notificación</Typography>
                                    <NotificationImportantIcon
                                        sx={{
                                            color: `${data?.notificacion}?'#3761ED':'#B2B2B2`
                                        }}
                                        fontSize="small"
                                    />
                                    <Checkbox
                                        checked={data?.notificacion || false}
                                        value={data?.notificacion || false}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setModifiedValues({
                                                ...modifiedValues,
                                                notificacion: event.target.checked
                                            });

                                            setData({
                                                ...data,
                                                notificacion: event.target.checked
                                            });
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Typography>Push</Typography>
                                    <InfoIcon
                                        sx={{
                                            color: `${data?.push}?'#3761ED':'#B2B2B2`
                                        }}
                                        fontSize="small"
                                    />
                                    <Checkbox
                                        name="push"
                                        checked={data?.push || false}
                                        value={data?.push || false}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setModifiedValues({
                                                ...modifiedValues,
                                                push: event.target.checked
                                            });
                                            setData({
                                                ...data,
                                                push: event.target.checked
                                            });
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Typography>Mail</Typography>
                                    <EmailIcon
                                        sx={{
                                            color: `${data?.mail}?'#3761ED':'#B2B2B2`
                                        }}
                                        fontSize="small"
                                    />
                                    <Checkbox
                                        name="mail"
                                        checked={data?.mail || false}
                                        value={data?.mail || false}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setModifiedValues({
                                                ...modifiedValues,
                                                mail: event.target.checked
                                            });
                                            setData({
                                                ...data,
                                                mail: event.target.checked
                                            });
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </SectionFormAccordion>

                <Grid container direction="row" justifyContent="center" alignItems="center" mt={6}>
                    <Box>
                        <ButtonActions
                            id="update_communication"
                            disabled={_.isEmpty(modifiedValues)}
                            confirmText={t('accept')}
                            loading={editCom}
                            renderBackAction={false}
                            returnText="Volver"
                            flexDirection="column-reverse"
                        />
                    </Box>
                </Grid>
            </Box>
            <CommunicationModal
                open={modalOpen}
                setOpen={setModalOpen}
                type={type}
                remplazosMensaje={commData?.remplazosMensaje}
                remplazosMensajeCorto={commData?.emplazosMensajeCorto}
            />
        </>
    );
};
export default ComunicacionesDataForm;
