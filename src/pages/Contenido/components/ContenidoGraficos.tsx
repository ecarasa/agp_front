import React from 'react';
import _ from 'lodash';
import { Box, Grid } from '@mui/material';
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
import AddIcon from '@mui/icons-material/Add';
import Button from '../../../components/button/Button';
import CollapseItem from './ColapseItem';
import { useNavigate } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import useService from '../hooks/useService';
import { IdSeccionesEnum, SeccionesEnum, TiposContenidoEnum } from '../ContenidoIndex';
import { newsGestorApi } from '../../../services/newsApi';
import DeleteBtn from './DeleteButtons';
import UpdateBtn from './UpdateButtons';
import PublishBtn from './PublishButton';

export type DataArray = { titulo: string; name: string; value: string };
export type Contenido = {
    id: number;
    tipo: string;
    titulo?: string;
    contenido?: string;
    copete?: string;
    urlImagen?: string;
    urlImagenMin?: string;
    urlContenido?: string;
    fecha: string;
    orden?: number;
};

export type InputData = {
    label: string;
    name: string;
};

type NewDataInsert = { titulo: string; contenido: string; copete: string; urlImagen: string };
type NewBoxProps = {
    fields: InputData[];
    modifiedValues: any;
    handleChangeNew: (e: React.ChangeEvent<HTMLInputElement>) => void;
    creatingContent: boolean;
    t: any;
};
type InputBoxProps = {
    fields: InputData[];
    index: number;
    info: any;
    captionOn: string;
    captionOff: string;
    updatingContent: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
    onUpdateClick: (data: any) => void;
};

const NewGraphBox: React.FC<NewBoxProps> = ({
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
                <Typography sx={{ mt: 1 }}>{t('publish-caption')}</Typography>
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
                        confirmText={t('accept')}
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

const ItemInputs: React.FC<InputBoxProps> = ({
    index,
    fields,
    info,
    captionOn,
    captionOff,
    updatingContent,
    handleChange,
    onUpdateClick
}) => {
    return (
        <Grid item xs={12} sm={12} key={index}>
            <CollapseItem title={`Grafico ${index + 1}`}>
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
                                value={info[i.name]}
                                onChange={(e: any) => handleChange(e, index)}
                                required
                            />
                        </Box>
                    ))}

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                            gap: 1
                        }}
                    >
                        <UpdateBtn
                            captionOn={captionOn}
                            captionOff={captionOff}
                            updatingContent={updatingContent}
                            updateContent={() => onUpdateClick(info)}
                        />
                    </Box>
                </Box>
            </CollapseItem>
        </Grid>
    );
};

const ContenidoGraficos = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation('content');
    const navigate = useNavigate();
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

    const publicContent: any = useAppSelector(selectCurrentContent);
    const { secciones } = publicContent;

    const initValues = {
        titulo: '',
        contenido: '',
        copete: '',
        urlImagen: ''
    };
    const [step, setStep] = useState<number>(0);
    const [isNew, setIsNew] = useState<boolean>(false);
    const [hasEdit, setHasEdit] = useState<boolean>(false);
    const [infoUtil, setInfoUtil] = useState<Contenido[]>([]);
    const [modifiedValues, setModifiedValues] = useState<NewDataInsert>(initValues);

    const fields: InputData[] = [
        { name: 'titulo', label: t('inputs.title') },
        { name: 'contenido', label: t('inputs.content') },
        { name: 'copete', label: t('inputs.year') },
        { name: 'urlImagen', label: t('inputs.url') }
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
        setHasEdit(true);
        const { name, value } = e?.target;
        let data = [...infoUtil];
        data.forEach((obj: any, index: number, arr: any) => {
            if (index === ix) {
                arr[index] = { ...arr[index], [name]: value };
            }
        });
        setInfoUtil(data);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!urlPatternValidation(modifiedValues.urlImagen)) {
            enqueueSnackbar('La url debe ser válida', { variant: 'error' });
            return false;
        }
        await createContent(
            {
                ...modifiedValues,
                tipoContenido: TiposContenidoEnum.CARD,
                urlContenido: undefined,
                urlImagenMin: undefined
            },
            getSeccion().id
        );
        dispatch(newsGestorApi.util.resetApiState());
        refetchContentData();
    };

    const onDeleteClick = async (item: any) => {
        await removeContentById(item.id);
        dispatch(newsGestorApi.util.resetApiState());
        refetchContentData();
    };

    const onUpdateClick = async (item: any) => {
        const { titulo, contenido, copete, urlImagen } = item;
        await updateContentById({ titulo, contenido, copete, urlImagen }, item.id);
        enqueueSnackbar('Editado exitosamente!', { variant: 'success' });
        dispatch(newsGestorApi.util.resetApiState());
        refetchContentData();
    };

    const getSeccion = () => {
        return (
            filterByKey(publicContent.secciones, SeccionesEnum.INFO_UTIL, 'seccion')[0] ||
            publicContent.secciones[3]
        );
    };

    const handleBackButton = () => {
        if (step === 0) navigate('/agp/gestor-contenidos');
        setStep((prev) => prev - 1);
        setModifiedValues(initValues);
        setHasEdit(false);
        setIsNew(false);
    };

    useEffect(() => {
        if (_.isEmpty(publicContent?.secciones)) {
            //navigate('/agp/gestor-contenidos');
            
        } else {
            const data =
                filterByKey(publicContent.secciones, SeccionesEnum.INFO_UTIL, 'seccion')[0] ||
                publicContent.secciones[3];
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
                    <SectionHeader.DrawerTitle> {t('graphics')}</SectionHeader.DrawerTitle>
                </SectionHeader>
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
                                            {t('publish-caption')}
                                        </Typography>
                                    </Grid>
                                    <PublishBtn
                                        key='publish-btn-graficos'
                                        captionOn={t('publish')}
                                        captionOff={t('publishing')}
                                        publishingContent={false}
                                        publishContent={() => onPublishClick(IdSeccionesEnum.ID_SECCION_INFO_UTIL)}
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
                                    {/* <Grid item xs={12} sm={3}>
                                        <Button
                                            style={{
                                                minWidth: 160,
                                                background: 'var(--white)',
                                                color: 'blue'
                                            }}
                                            type="outlined"
                                            startIcon={<AddIcon />}
                                            onClick={() => {
                                                setIsNew(true);
                                                setStep(1);
                                            }}
                                        >
                                            {t('new-graphic')}
                                        </Button>
                                    </Grid> */}
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* *********************************** */}
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
                                    {infoUtil?.map((info: any, index: number) => (
                                        <ItemInputs
                                            index={index}
                                            fields={fields}
                                            info={info}
                                            captionOn={t('save')}
                                            captionOff={t('saving')}
                                            updatingContent={updatingContent}
                                            handleChange={(e, index) => handleChange(e, index)}
                                            onUpdateClick={() => onUpdateClick(info)}
                                        />
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
                )}

                {step === 1 && (
                    <NewGraphBox
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

export default ContenidoGraficos;
