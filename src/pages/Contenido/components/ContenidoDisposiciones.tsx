import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { newsGestorApi, useGetContentDisposicionesQuery } from '../../../services/newsApi';
import { Box, Grid, Typography, Menu, MenuItem, Checkbox, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

import SectionHeader from '../../../components/SectionHeader';
import styles from './styles.module.css';

import Button from '../../../components/button/Button';
import { useNavigate } from 'react-router-dom';

import { useIsMobile } from '../../../hooks/useIsMobile';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { enqueueSnackbar } from 'notistack';

import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AddIcon from '@mui/icons-material/Add';
import TextFileElement from '../../../components/layout/TextFile';
import DatePickerComponent from '../../../components/layout/DatePicker';
import { urlPatternValidation } from '../../../utils/common';
import Loading from '../../../components/Loading';
import SaveBtn from './SaveButton';
import UpdateBtn from './UpdateButtons';
import PublishBtn from './PublishButton';
import useService from '../hooks/useService';

import { IdSeccionesEnum, TiposContenidoEnum } from '../ContenidoIndex';

type Seccion = {
    id: number;
    seccion: string;
    titulo: string;
    subtitulo: any;
    urlImagen: any;
    orden: number;
    contenido: Contenido[];
};

type Contenido = {
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

export enum DisposicionesEnum {
    DISPOSICIONES = 'Disposiciones',
    MANUALES = 'Manuales'
}

const commonStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    gap: { xs: 1, md: 5 }
};

const DisposicionBtn = ({ data, onClick }: { data: any; onClick: (data: any) => void }) => {
    return (
        <Box
            minWidth={{ sm: '433px' }}
            className={styles['btn-detail']}
            onClick={() => onClick(data)}
        >
            {data.titulo}
            <KeyboardArrowRightIcon />
        </Box>
    );
};

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper
}));

const ContenidoDisposiciones = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { t } = useTranslation('content');
    const { isMobile } = useIsMobile();
    const {
        loadingContent,
        updatingContent,
        removingContent,
        creatingContent,
        createContent,
        updateContentById,
        removeContentById,
        publishContent
    } = useService();

    const [seccion, setSeccion] = useState<Seccion[]>([]);
    const [step, setStep] = useState<number>(0);
    const [isNew, setIsNew] = useState<boolean>(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [selectedSeccion, setSelectedSeccion] = useState<number>(0);

    const [modifiedValues, setModifiedValues] = useState<any>(null);
    const [data, setData] = useState<any>(null);

    const {
        data: disposiciones,
        isLoading,
        refetch: refetchDispositions
    } = useGetContentDisposicionesQuery({}, { refetchOnMountOrArgChange: true });

    const handleChange = (event: any) => {
        event.preventDefault();
        setData({ ...data, [event.target.id]: event.target.value });
        setModifiedValues({ ...modifiedValues, [event.target.id]: event.target.value });
    };

    const handleClick = (item: any) => {
        const { contenido } = item;
        setSelected(contenido);
        setSelectedSeccion(item.id);
        setStep((prev) => prev + 1);
    };

    useEffect(() => {
        if (seccion && selectedSeccion) {
            const updatedSeccion = seccion.find((i: any) => i.id === selectedSeccion);
            setSelected(updatedSeccion?.contenido);
        }
        // eslint-disable-next-line
    }, [seccion]);

    const handleClickAction = (event: any, item: any) => {
        setData(item);
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };

    const handleNew = () => {
        setIsNew(true);
        setModifiedValues(null);
        setData(null);
        setStep(2);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setMenuOpen(false);
    };

    const handleBackButton = () => {
        if (step === 0) navigate('/agp/gestor-contenidos');
        setStep((prev) => prev - 1);
        setModifiedValues(null);
        setIsNew(false);
    };

    const onDeleteClick = async () => {
        await removeContentById(data.id);
        dispatch(newsGestorApi.util.resetApiState());
        refetchDispositions();
        setData(null);
        setIsNew(false);
        setModifiedValues(null);
    };

    const onUpdateClick = async (item: any) => {
        const { titulo, urlContenido, fecha } = item;
        await updateContentById({ titulo, urlContenido, fecha, tipo: 'hipervinculo' }, item.id);
        enqueueSnackbar('Editado exitosamente!', { variant: 'success' });
        dispatch(newsGestorApi.util.resetApiState());
        await refetchDispositions();
        setStep(1);
        setData(null);
        setIsNew(false);
        setModifiedValues(null);
    };

    const onCreateClick = async (item: any) => {
        const { titulo, urlContenido, fecha } = item;
        if (!urlPatternValidation(urlContenido)) {
            enqueueSnackbar('La url debe ser válida', { variant: 'error' });
            return false;
        }
        await createContent(
            {
                ...item,
                tipoContenido: TiposContenidoEnum.HIPERVINCULO,
                contenido: undefined,
                urlImagen: undefined,
                urlImagenMin: undefined
            },
            selectedSeccion
        );
        enqueueSnackbar('Editado exitosamente!', { variant: 'success' });
        dispatch(newsGestorApi.util.resetApiState());
        await refetchDispositions();
        setStep(1);
        setData(null);
        setIsNew(false);
        setModifiedValues(null);
    };

    const onPublishClick = async (idSeccion: number) => {
        await publishContent(idSeccion);
        enqueueSnackbar('Publicado exitosamente!', { variant: 'success' });
        dispatch(newsGestorApi.util.resetApiState());
    };

    useEffect(() => {
        if (disposiciones) {
            setSeccion(disposiciones?.data?.secciones);
        }
    }, [disposiciones]);
    return (
        <>
            <Box
                component="div"
                sx={{ padding: { sm: 0, md: '20px 65px' }, paddingBottom: 10 }}
                justifyContent="center"
            >
                <SectionHeader>
                    <SectionHeader.DrawerTitle> {t('docs')}</SectionHeader.DrawerTitle>
                </SectionHeader>
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
                                    {step === 0
                                        ? t('provisions-caption')
                                        : step === 2
                                        ? t('provisions-caption-2')
                                        : ''}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}></Grid>
                        </Grid>
                    </Grid>

                    {step === 0 && (
                        <Grid item xs={12}>
                            <Grid
                                container
                                spacing={3}
                                mb={2}
                                columnSpacing={{ xs: 12, sm: 6, lg: 24 }}
                            >
                                <Grid item xs={12} sm={3}>
                                    <Box>
                                        <Grid container spacing={0} sx={commonStyle}>
                                            {seccion &&
                                                seccion?.map((data: Seccion) => (
                                                    <Grid item xs={12} md={4} key={data.id}>
                                                        <DisposicionBtn
                                                            data={data}
                                                            onClick={() => handleClick(data)}
                                                        />
                                                    </Grid>
                                                ))}
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
                {isLoading && <Loading />}

                {/* grid */}
                {step === 1 && (
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                paddingBottom: 5,
                                gap: 5
                            }}
                        >
                            <Button
                                style={{
                                    minWidth: 160,
                                    background: 'var(--white)',
                                    color: 'blue'
                                }}
                                type="outlined"
                                startIcon={isMobile ? null : <AddIcon />}
                                onClick={handleNew}
                            >
                                {t('new-provision')}
                            </Button>
                            <PublishBtn
                                key="publish-btn-disposiciones"
                                captionOn={t('publish')}
                                captionOff={t('publishing')}
                                publishingContent={false}
                                publishContent={() =>
                                    onPublishClick(IdSeccionesEnum.ID_SECCION_MANUALES)
                                }
                            />
                        </Box>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="flex-start"
                            spacing={3}
                        >
                            <Grid item xs={12} md={12}>
                                <Demo>
                                    <List
                                        dense={true}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: isMobile ? 1 : 3,
                                            background: 'none'
                                        }}
                                    >
                                        {selected?.map((item: any, index: number) => (
                                            <ListItem
                                                key={item.id}
                                                sx={{
                                                    gap: isMobile ? 1 : 2,
                                                    padding: '10px',
                                                    border: '0 0 0 1px solid',
                                                    boxShadow: '0 3px 3px #888888',
                                                    paddingLeft: isMobile ? 1 : 4
                                                }}
                                                secondaryAction={
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="delete"
                                                        onClick={(e) => handleClickAction(e, item)}
                                                    >
                                                        {removingContent &&
                                                        item?.id === data?.id ? (
                                                            <CircularProgress
                                                                style={{ margin: '0 10px' }}
                                                                size="1.2em"
                                                            />
                                                        ) : (
                                                            <MoreVertIcon />
                                                        )}
                                                    </IconButton>
                                                }
                                            >
                                                <PictureAsPdfIcon />
                                                <ListItemText primary={item?.titulo} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Demo>
                            </Grid>
                        </Grid>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={menuOpen}
                            onClose={handleCloseMenu}
                        >
                            <MenuItem
                                onClick={(event: any) => {
                                    event.stopPropagation();
                                    handleCloseMenu();
                                    setStep((prev) => prev + 1);
                                }}
                            >
                                {t('edit')}
                            </MenuItem>
                            <MenuItem
                                onClick={(event: any) => {
                                    event.stopPropagation();
                                    handleCloseMenu();
                                    onDeleteClick();
                                }}
                            >
                                {t('delete')}
                            </MenuItem>
                        </Menu>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Grid
                            container
                            justifyContent="flex-start"
                            spacing={4}
                            sx={{
                                margintop: 3,
                                marginLeft: '-18px',
                                '& .MuiInputBase-root': {
                                    borderRadius: '10px'
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    marginTop: 5,
                                    padding: 3,
                                    borderRadius: '10px',
                                    background: '#FFF'
                                }}
                            >
                                <Grid item xs={12}>
                                    <Grid
                                        container
                                        spacing={3}
                                        mb={2}
                                        columnSpacing={{ xs: 12, sm: 6, lg: 24 }}
                                    >
                                        <Grid item xs={12} sm={6}>
                                            <DatePickerComponent
                                                required
                                                value={data?.fecha}
                                                label="Fecha de Publicación"
                                                name="fecha"
                                                id="fecha"
                                                setValue={(value: any) => {
                                                    setData({ ...data, fecha: value });
                                                    setModifiedValues({
                                                        ...modifiedValues,
                                                        fecha: value
                                                    });
                                                }}
                                                disablePast={false}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}></Grid>
                                        <Grid item xs={12} sm={12}>
                                            <TextFileElement
                                                name={data?.titulo || ''}
                                                label={t('inputs.title')}
                                                onChange={handleChange}
                                                required={true}
                                                fullWidth
                                                id="titulo"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <TextFileElement
                                                name={data?.urlContenido}
                                                label={t('inputs.urlContenido')}
                                                required={true}
                                                fullWidth={true}
                                                onChange={handleChange}
                                                id="urlContenido"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="end"
                                    alignItems="center"
                                    mt={8}
                                    paddingBottom={4}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'end',
                                            gap: 1
                                        }}
                                    >
                                        {!isNew ? (
                                            <UpdateBtn
                                                captionOn={t('save')}
                                                captionOff={t('saving')}
                                                updatingContent={updatingContent}
                                                updateContent={() => onUpdateClick(data)}
                                            />
                                        ) : (
                                            <SaveBtn
                                                captionOn={t('save')}
                                                captionOff={t('saving')}
                                                savingContent={creatingContent}
                                                saveContent={() => onCreateClick(data)}
                                            />
                                        )}
                                    </Box>
                                </Grid>
                            </Box>
                        </Grid>
                    </>
                )}

                <Box
                    marginTop={{ xs: 2, sm: 0 }}
                    sx={{
                        fontSize: '18px',
                        padding: { sm: 0, md: '25px 65px' },
                        marginTop: '15px'
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

export default ContenidoDisposiciones;
