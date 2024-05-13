import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import SectionHeader from '../../components/SectionHeader';
import ContentCard from './components/Cards';
import { useIsMobile } from '../../hooks/useIsMobile';
import Loading from '../../components/Loading';

export interface ContentMenu {
    ix: number;
    titleKey: string;
    url: string;
}
export enum SeccionesEnum {
    HEADER = 'Header',
    NOTICIAS = 'Noticias',
    ACCESOS = 'Accesos',
    INFO_UTIL = 'Información Útil',
    VIDEOS = 'Conoce el Puerto',
    NOVEDADES = 'Novedades'
}
export enum IdSeccionesEnum {
    ID_SECCION_HEADER = 11,
    ID_SECCION_NOTICIAS = 2,
    ID_SECCION_ACCESOS = 3,
    ID_SECCION_INFO_UTIL = 4,
    ID_SECCION_VIDEOS = 5,
    ID_SECCION_MANUALES = 6,
    ID_SECCION_RESOLUCIONES = 7,
    ID_SECCION_NOVEDADES = 1,
    ID_SECCION_MAPA_SITIO = 8,
    ID_SECCION_REDES_SOCIALES = 9,
    ID_SECCION_ABOUT = 10,
    ID_SECCION_FOOTER = 12
}
export enum TiposContenidoEnum {
    TEXTO = 'texto',
    HIPERVINCULO = 'hipervinculo',
    VIDEO = 'video',
    CARD = 'card',
    IMAGEN = 'imagen'
}
function ContenidoIndex() {
    const navigate = useNavigate();

    const { t } = useTranslation('content');
    const { isMobile } = useIsMobile();
    //const { loadingContent, loadingContentByPage } = useService();

    const contentMenu: ContentMenu[] = [
        {
            ix: 0,
            titleKey: 'graphics',
            url: 'graficos'
        },
        {
            ix: 1,
            titleKey: 'videos',
            url: 'videos'
        },
        {
            ix: 2,
            titleKey: 'news',
            url: 'noticias'
        },
        {
            ix: 3,
            titleKey: 'about',
            url: 'novedades'
        },
        {
            ix: 4,
            titleKey: 'provisions',
            url: 'disposiciones'
        }
    ];
    //const loading = loadingContentByPage || loadingContent;
    const loading = false;
    const setSelectedItem = (data: any) => {
        if (loading) return;
        navigate(`/agp/gestor-contenidos/${data?.url}`);
    };

    return (
        <>
            <SectionHeader>
                <SectionHeader.Title>{t('title')}</SectionHeader.Title>
            </SectionHeader>

            {loading ? (
                <Loading />
            ) : (
                <Grid
                    container={isMobile ? false : true}
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-start"
                    spacing={{ xs: 0, sm: 2, md: 6 }}
                    paddingX={{ xs: 0, sm: 2, md: 5, lg: 10, xl: 30 }}
                    marginLeft={{ xs: 8, sm: 0 }}
                >
                    {contentMenu.map((item) => (
                        <Grid
                            key={item.ix}
                            item={isMobile ? false : true}
                            xs={12}
                            sm={6}
                            md={4}
                            mb={2}
                            mt={2}
                        >
                            <ContentCard
                                item={item}
                                title={t(item?.titleKey)}
                                setSelectedItem={setSelectedItem}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );
}

export default ContenidoIndex;
