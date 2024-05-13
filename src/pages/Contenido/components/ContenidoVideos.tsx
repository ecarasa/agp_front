import _ from 'lodash';
import { Box, Grid, CircularProgress } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { filterByKey, urlPatternValidation } from '../../../utils/common';
import { selectCurrentContent } from '../../../features/slices/applicationSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { useEffect, useState } from 'react';
import ButtonActions from '../../../components/ButtonActions';
import Input from '../../../components/Input/Input';
import SectionHeader from '../../../components/SectionHeader';

import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/button/Button';
import CollapseItem from './ColapseItem';

import { newsGestorApi } from '../../../services/newsApi';
import { SeccionesEnum } from '../ContenidoIndex';

import AddIcon from '@mui/icons-material/Add';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import useService from '../hooks/useService';
import DeleteBtn from './DeleteButtons';
import UpdateBtn from './UpdateButtons';
import Loading from '../../../components/Loading';
import { useIsMobile } from '../../../hooks/useIsMobile';
import PublishBtn from './PublishButton';
import { IdSeccionesEnum, TiposContenidoEnum } from '../ContenidoIndex';


export type DataArray = { titulo: string; name: string; value: string };
export type Contenido = {
    id?: number;
    tipo?: string;
    titulo?: string;
    contenido?: string;
    copete?: string;
    urlImagen?: string;
    urlImagenMin?: string;
    urlContenido?: string;
    fecha?: string;
    orden?: number;
};

export type InputData = {
    id: string;
    label: string;
    name: string;
};
type NewDataInsert = { titulo: string; urlContenido: string };

type NewBoxProps = {
    fields: InputData[];
    modifiedValues: any;
    handleChangeNew: (e: React.ChangeEvent<HTMLInputElement>) => void;
    creatingContent: boolean;
    t: any;
};

const NewVideoBox: React.FC<NewBoxProps> = ({
    fields,
    modifiedValues,
    handleChangeNew,
    creatingContent,
    t
}) => {
    return (
        <Grid
            container
            justifyContent="flex-start"
            spacing={4}
            sx={{
                '& .MuiInputBase-root': {
                    borderRadius: '10px'
                }
            }}
        >
            <Grid item xs={12} sm={9}>
                <Typography sx={{ mt: 1 }}>{t('videos-caption')}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={3} mb={2} columnSpacing={{ xs: 12, sm: 6, lg: 24 }}>
                    <Grid item xs={12} sm={12}>
                        <Box
                            sx={{
                                paddingBottom: 2,
                                borderRadius: 5,
                                background: 'white',
                                border: 1,
                                borderColor: '#E0E0E0',
                                p: 4
                            }}
                        >
                            {fields.map((i: any, ix: number) => (
                                <Box key={ix} sx={{ paddingBottom: 2 }}>
                                    <Input
                                        label={i.label}
                                        name={i.name}
                                        value={modifiedValues[i.name]}
                                        onChange={(e: any) => handleChangeNew(e)}
                                        required
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Grid>

            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                mt={6}
                ml={4}
            >
                <Box>
                    <ButtonActions
                        id="create_graphics"
                        disabled={_.isEmpty(modifiedValues)}
                        confirmText={t('save')}
                        loading={creatingContent}
                        renderBackAction={false}
                        returnText="Volver"
                        flexDirection="column-reverse"
                    />
                </Box>
            </Grid>
        </Grid>
    );
};

const ContenidoVideos = () => {
    const publicContent: any = useAppSelector(selectCurrentContent);
    const { secciones } = publicContent;
    const dispatch = useAppDispatch();

    const { t } = useTranslation('content');
    const navigate = useNavigate();
    const { isMobile } = useIsMobile();

    const {
        loadingContent,
        updatingContent,
        removingContent,
        creatingContent,
        refetchContentData,
        createContent,
        updateContentById,
        removeContentById,
        publishContent,
    } = useService();

    const initValues = { titulo: '', urlContenido: '' };

    const [step, setStep] = useState<number>(0);
    const [infoUtil, setInfoUtil] = useState<Contenido[]>([initValues]);
    const [modifiedValues, setModifiedValues] = useState<NewDataInsert>(initValues);

    const fields: InputData[] = [
        { id: 'inId1', name: 'titulo', label: t('inputs.title') },
        { id: 'inId2', name: 'urlContenido', label: t('inputs.url') }
    ];

    const onPublishClick = async (idSeccion: number) => {
        await publishContent(idSeccion);
        enqueueSnackbar('Publicado exitosamente!', { variant: 'success' });
        dispatch(newsGestorApi.util.resetApiState());
    };

    const handleChangeNew = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e?.target;
        setModifiedValues({ ...modifiedValues, [name]: value });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, ix: number) => {
        const { name, value } = e?.target;
        let data = [...infoUtil];
        data.forEach((obj: any, index: number, arr: any) => {
            if (index === ix) {
                arr[index] = { ...arr[index], [name]: value };
            }
        });
        setInfoUtil(data);
    };

    const onDeleteClick = async (item: any) => {
        await removeContentById(item.id);
        dispatch(newsGestorApi.util.resetApiState());
        refetchContentData();
    };

    const onUpdateClick = async (item: any) => {
        const { titulo, urlcontenido } = item;
        await updateContentById({ titulo, urlcontenido }, item.id);
        enqueueSnackbar('Editado exitosamente!', { variant: 'success' });
        dispatch(newsGestorApi.util.resetApiState());
        refetchContentData();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!urlPatternValidation(modifiedValues.urlContenido)) {
            enqueueSnackbar('La url debe ser válida', { variant: 'error' });
            return false;
        }
        const id = filterByKey(publicContent.secciones, SeccionesEnum.VIDEOS, 'seccion')[0].id;
        await createContent(
            {
                ...modifiedValues,
                tipoContenido: TiposContenidoEnum.VIDEO,
                urlImagenMin: undefined
            },
            id
        );
        dispatch(newsGestorApi.util.resetApiState());
        refetchContentData();
        handleBackButton();
    };

    const handleBackButton = () => {
        if (step === 0) navigate('/agp/gestor-contenidos');
        setStep((prev) => prev - 1);
        setModifiedValues(initValues);
    };

    useEffect(() => {
        if (_.isEmpty(publicContent?.secciones)) {
            //navigate('/agp/gestor-contenidos');
        } else {
            const data =
                filterByKey(publicContent.secciones, SeccionesEnum.VIDEOS, 'seccion')[0] ||
                publicContent.secciones[4];
            setInfoUtil(data.contenido);
        }
        // eslint-disable-next-line
    }, [secciones]);

    return (
        <>
            <Box
                component="form"
                sx={{ padding: { sm: 0, md: '20px 65px' }, paddingBottom: 10 }}
                justifyContent="center"
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <SectionHeader>
                    <SectionHeader.DrawerTitle> {t('videos')}</SectionHeader.DrawerTitle>
                </SectionHeader>

                {/* {loadingContent && <Loading />} */}

                {step === 0 && (
                    <>
                        <Grid
                            container
                            justifyContent="flex-start"
                            spacing={4}
                            sx={{
                                '& .MuiInputBase-root': {
                                    borderRadius: '10px'
                                }
                            }}
                        >
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    spacing={3}
                                    mb={2}
                                    columnSpacing={{ xs: 12, sm: 6, lg: 24 }}
                                >
                                    <Grid item xs={12} sm={9}>
                                        <Typography sx={{ mt: 1 }}>
                                            {t('videos-caption')}
                                        </Typography>
                                    </Grid>
                                    <PublishBtn
                                                key='publish-btn-videos'
                                                captionOn={t('publish')}
                                                captionOff={t('publishing')}
                                                publishingContent={false}
                                                publishContent={() => onPublishClick(IdSeccionesEnum.ID_SECCION_VIDEOS)}
                                            />
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    spacing={3}
                                    mb={2}
                                    columnSpacing={{ xs: 12, sm: 6, lg: 24 }}
                                >
                                    <Grid item xs={12} sm={3}>
                                        <Button
                                            style={{
                                                minWidth: 160,
                                                background: 'var(--white)',
                                                color: 'blue'
                                            }}
                                            type="outlined"
                                            startIcon={<AddIcon />}
                                            onClick={() => {
                                                setStep(1);
                                            }}
                                        >
                                            {t('new-video')}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            justifyContent="flex-start"
                            spacing={4}
                            sx={{
                                '& .MuiInputBase-root': {
                                    borderRadius: '10px'
                                }
                            }}
                        >
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    spacing={3}
                                    mb={2}
                                    columnSpacing={{ xs: 12, sm: 6, lg: 24 }}
                                >
                                    {infoUtil.map((info: any, index: number) => (
                                        <Grid item xs={12} sm={12} key={info.id}>
                                            <CollapseItem title={`Video ${index + 1}`}>
                                                <Box
                                                    sx={{
                                                        paddingBottom: 2,
                                                        borderRadius: 5,
                                                        border: 1,
                                                        borderColor: '#FFF',
                                                        background: '#FFF',
                                                        p: 4
                                                    }}
                                                >
                                                    {fields.map((i: any) => (
                                                        <Box key={i.id} sx={{ paddingBottom: 2 }}>
                                                            <Input
                                                                label={i.label}
                                                                name={i.name}
                                                                value={info[i.name]}
                                                                onChange={(
                                                                    e: React.ChangeEvent<HTMLInputElement>
                                                                ) => handleChange(e, index)}
                                                                required
                                                            />
                                                        </Box>
                                                    ))}
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: isMobile
                                                                ? 'center'
                                                                : 'end',
                                                            gap: 1
                                                        }}
                                                    >
                                                        <DeleteBtn
                                                            captionOn={t('delete')}
                                                            captionOff={t('deleting')}
                                                            removingContent={removingContent}
                                                            deleteContent={() =>
                                                                onDeleteClick(info)
                                                            }
                                                        />
                                                        <UpdateBtn
                                                            captionOn={t('save')}
                                                            captionOff={t('saving')}
                                                            updatingContent={updatingContent}
                                                            updateContent={() =>
                                                                onUpdateClick(info)
                                                            }
                                                        />
                                                    </Box>
                                                </Box>
                                            </CollapseItem>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
                )}

                {step === 1 && !loadingContent && (
                    <NewVideoBox
                        t={t}
                        fields={fields}
                        modifiedValues={modifiedValues}
                        creatingContent={creatingContent}
                        handleChangeNew={handleChangeNew}
                    />
                )}

                <Box
                    marginTop={{ xs: 2, sm: 0 }}
                    sx={{
                        fontSize: '18px',
                        padding: { sm: 0, md: '25px 65px' }
                    }}
                    className="flex-center"
                >
                    <Button
                        style={{ minWidth: '170px', background: 'var(--white)' }}
                        type="outlined"
                        onClick={handleBackButton}
                    >
                        {t('back')}
                    </Button>
                </Box>
            </Box>
        </>
    );
};
export default ContenidoVideos;
