import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { Box, Grid, Typography, Checkbox, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../../hooks/useIsMobile';

import AddIcon from '@mui/icons-material/Add';
import SectionHeader from '../../../components/SectionHeader';
import Button from '../../../components/button/Button';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TextFileElement from '../../../components/layout/TextFile';
import DatePickerComponent from '../../../components/layout/DatePicker';
import Loading from '../../../components/Loading';
import NewsCard from '../../HomePrivado/components/News/NewsCard';
import useGlobalFilters from '../../../hooks/useGlobalFilters';
import NewsDetail from '../../HomePrivado/components/News/NewsDetail';
import useContentNovedades from '../hooks/useContentNovedades';
import useService from '../hooks/useService';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { selectCurrentContent, showAlert } from '../../../features/slices/applicationSlice';
import ButtonActions from '../../../components/ButtonActions';
import { filterByKey } from '../../../utils/common';
import { SeccionesEnum, IdSeccionesEnum, TiposContenidoEnum } from '../ContenidoIndex';
import PublishBtn from './PublishButton';
import { enqueueSnackbar } from 'notistack';

export enum MenuOptionsEnum {
    EDIT = 'edit',
    DELETE = 'delete'
}

const ContenidoNovedades = () => {
    const { t } = useTranslation('content');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isMobile } = useIsMobile();
    const { filters, setFilters } = useGlobalFilters();
    const publicContent: any = useAppSelector(selectCurrentContent);

    const {
        updatingContent,
        removingContent,
        creatingContent,
        createContent,
        updateContentById,
        removeContentById,
        publishContent,
    } = useService();
    const {
        setSelectedItem,
        selectedItem,
        isLoading,
        isFetching,
        //refetchPublicData,
        items,
        news,
        handleLoadMore
    } = useContentNovedades();

    const [page, setPage] = useState(0);
    const [step, setStep] = useState<number>(0);
    const [isNew, setIsNew] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [modifiedValues, setModifiedValues] = useState<any>(null);
    const [data, setData] = useState<any>(null);

    const handleChange = (event: any) => {
        event.preventDefault();
        setData({ ...data, [event.target.id]: event.target.value });
        setModifiedValues({ ...modifiedValues, [event.target.id]: event.target.value });
    };

    // const getSeccion = () => {
    //     const { secciones } = publicContent;
    //     return filterByKey(secciones, SeccionesEnum.NOVEDADES, 'seccion')[0] || secciones[3];
    // };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        isNew
            ? await createContent(
                  {
                      ...modifiedValues,
                      tipoContenido: modifiedValues?.urlContenido !==undefined ? TiposContenidoEnum.HIPERVINCULO : TiposContenidoEnum.TEXTO,
                      urlContenido: undefined,
                      urlImagenMin: undefined
                  },
                  IdSeccionesEnum.ID_SECCION_NOVEDADES
              )
            : await updateContentById(modifiedValues, data?.id);

        setStep(0);
        setData(null);
        setIsNew(false);
        setModifiedValues(null);
        //refetchPublicData();
    };

    const handleChangePage = (_: any, newPage: number) => {
        const skip = filters.skip;
        const take = filters.take;
        setFilters({
            ...filters,
            skip: newPage > page ? skip + take : skip - take
        });
        setPage(newPage);
    };

    useEffect(() => {
        if (filters.skip === 0) setPage(0);
        // eslint-disable-next-line
    }, [filters]);

    const handleCardBackButton = () => {
        setShowDetail(false);
        setSelectedItem(null);
        setStep(0);
    };
    const handleBackButton = () => {
        if (step === 0) navigate('/agp/gestor-contenidos');
        setStep((prev) => prev - 1);
        setModifiedValues(null);
        setIsNew(false);
    };

    const clickCard = (item: any) => {
        setShowDetail(true);
    };

    const handleConfirmRemove = (id: number) => {
        const handleRemoveNews = async () => {
            await removeContentById(id);
            //refetchPublicData();
        };

        dispatch(
            showAlert({
                title: t('alert-news.title'),
                message: t('alert-news.message'),
                confirmAction: handleRemoveNews,
                itemData: true,
                icon: 'info',
                cancelText: t('alert-news.cancelText')
            })
        );
    };

    const editCard = (item: any, mode = MenuOptionsEnum.EDIT) => {
        if (mode === MenuOptionsEnum.DELETE) {
            handleConfirmRemove(item.id);
        } else {
            setData(item);
            setShowDetail(false);
            setStep((prev) => prev + 1);
        }
    };

    const handleNew = () => {
        setIsNew(true);
        setModifiedValues(null);
        setData(null);
        setStep(1);
    };

    const handleEditNews = () => {
        editCard(selectedItem);
    };

    const onPublishClick = async (idSeccion: number) => {
        await publishContent(idSeccion);
        enqueueSnackbar('Publicado exitosamente!', { variant: 'success' });
    };

    return (
        <>
            {showDetail && selectedItem ? (
                <NewsDetail
                    selectedItem={selectedItem}
                    canEdit={true}
                    onEditButton={handleEditNews}
                    onBackButton={handleCardBackButton}
                />
            ) : (
                <>
                    {updatingContent ? (
                        <Loading />
                    ) : (
                        <Box
                            component="div"
                            sx={{ padding: { sm: 0, md: '20px 65px' }, paddingBottom: 5 }}
                            justifyContent="center"
                        >
                            <SectionHeader>
                                <SectionHeader.DrawerTitle> {t('about')}</SectionHeader.DrawerTitle>
                            </SectionHeader>
                                {step === 0 && (
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
                                                    {t('news-caption-2')}
                                                </Typography>
                                            </Grid>
                                            <PublishBtn
                                                key='publish-btn-novedades'
                                                captionOn={t('publish')}
                                                captionOff={t('publishing')}
                                                publishingContent={false}
                                                publishContent={() => onPublishClick(IdSeccionesEnum.ID_SECCION_NOVEDADES)}
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
                                                        minWidth: 170,
                                                        background: 'var(--white)',
                                                        color: 'blue'
                                                    }}
                                                    type="outlined"
                                                    startIcon={<AddIcon />}
                                                    onClick={handleNew}
                                                >
                                                    {t('new-about')}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            )}
                            
                            {step === 1 && (
                                <Grid item xs={12} sm={9}>
                                    <Typography sx={{ mt: 1 }}>{t('publish-caption')}</Typography>
                                </Grid>
                            )}

                            {step === 0 && (
                                <Grid
                                    container
                                    justifyContent="flex-start"
                                    spacing={4}
                                    sx={{
                                        marginTop: isMobile ? 0 : 3,
                                        '& .MuiInputBase-root': {
                                            borderRadius: '10px'
                                        }
                                    }}
                                >
                                    <>
                                        {!isLoading &&
                                            items?.map((item: any) => (
                                                <Grid
                                                    xs={12}
                                                    sm={6}
                                                    md={4}
                                                    item
                                                    key={item?.id}
                                                    className={isMobile ? 'flex-center' : ''}
                                                >
                                                    <NewsCard
                                                        item={item}
                                                        canEdit={true}
                                                        onEditClick={editCard}
                                                        onCardClicked={clickCard}
                                                        setSelectedItem={setSelectedItem}
                                                    />
                                                </Grid>
                                            ))}
                                        {!!news?.data?.data?.length && (
                                            <Grid item xs={12} className="flex-center">
                                                <Button
                                                    type="text"
                                                    onClick={handleLoadMore}
                                                    loading={isFetching}
                                                    style={{ minWidth: '150px' }}
                                                >
                                                    Cargar más
                                                </Button>
                                            </Grid>
                                        )}
                                    </>
                                </Grid>
                            )}
                            {isLoading && <Loading />}

                            {step === 1 && (
                                <>
                                    <Grid
                                        container
                                        justifyContent="flex-start"
                                        spacing={4}
                                        sx={{
                                            paddingTop: 2,
                                            '& .MuiInputBase-root': {
                                                borderRadius: '10px'
                                            }
                                        }}
                                    >
                                        <Grid
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            item
                                            className={isMobile ? 'flex-center' : ''}
                                        >
                                            <Box
                                                component="form"
                                                id="create-news"
                                                autoComplete="off"
                                                onSubmit={handleSubmit}
                                            >
                                                <Box
                                                    sx={{
                                                        marginTop: 1,
                                                        padding: 4,
                                                        borderRadius: '10px',
                                                        background: '#FFF'
                                                    }}
                                                >
                                                    <Grid item xs={12}>
                                                        <Grid
                                                            container
                                                            spacing={3}
                                                            mb={2}
                                                            columnSpacing={{
                                                                xs: 12,
                                                                sm: 6,
                                                                lg: 24
                                                            }}
                                                        >
                                                            <Grid item xs={12} sm={6}>
                                                                <DatePickerComponent
                                                                    required
                                                                    value={data?.fecha}
                                                                    label="Fecha de Publicación"
                                                                    name="fecha"
                                                                    id="fecha"
                                                                    setValue={(value: any) => {
                                                                        setData({
                                                                            ...data,
                                                                            fecha: value
                                                                        });
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
                                                                    name={data?.urlImagen}
                                                                    label={t('inputs.url')}
                                                                    required={true}
                                                                    fullWidth={true}
                                                                    onChange={handleChange}
                                                                    id="urlImagen"
                                                                />
                                                            </Grid>
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
                                                                    name={data?.copete || ''}
                                                                    label={t('inputs.subTitle')}
                                                                    onChange={handleChange}
                                                                    required={true}
                                                                    fullWidth
                                                                    id="copete"
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={12}>
                                                                <TextFileElement
                                                                    name={data?.contenido}
                                                                    label={t('inputs.content')}
                                                                    required={true}
                                                                    fullWidth={true}
                                                                    onChange={handleChange}
                                                                    id="contenido"
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justifyContent="end"
                                                    alignItems="center"
                                                    mt={3}
                                                    paddingBottom={1}
                                                >
                                                    <ButtonActions
                                                        id="create_news"
                                                        disabled={_.isEmpty(modifiedValues)}
                                                        confirmText={t('accept')}
                                                        loading={creatingContent}
                                                        renderBackAction={false}
                                                    />
                                                </Grid>
                                            </Box>
                                        </Grid>
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
                                    style={{ minWidth: '150px', background: 'var(--white)' }}
                                    type="outlined"
                                    onClick={handleBackButton}
                                >
                                    {t('back')}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </>
            )}
        </>
    );
};

export default ContenidoNovedades;
