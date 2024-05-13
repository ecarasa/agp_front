import _ from 'lodash';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Box } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/button/Button';
import Loading from '../../../../components/Loading';
import styles from './styles-news.module.css';

const boxStyles = {
    textAlign: 'initial',
    margin: '10px 35px',
    display: 'flex',
    '& .img-container': {
        maxWidth: '285px',
        position: 'relative',
        height: '100%',
        '& img': {
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            minHeight: '200px',
            display: 'block',
            borderRadius: '25px'
        }
    },
    '& .text-container': {
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        padding: '0 10px',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'column',
        maxHeight: '250px',
        '& p:first-of-type': {
            fontSize: '20px',
            fontWeight: 700,
            margin: '5px 0',
            maxHeight: '115px',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        '& p:last-of-type': {
            display: '-webkit-box',
            WebkitLineClamp: 2,
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical'
        }
    }
};

function NewsCarousel(props: any) {
    const { news, loadingNews } = props;
    const navigate = useNavigate();

    return (
        <>
            <Box className="carousel-container">
                <Carousel
                    className="carousel-home-priv"
                    showArrows={true}
                    autoPlay={true}
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop={true}
                    interval={5000}
                    stopOnHover={true}
                >
                    {loadingNews && !news ? (
                        <Loading size="small" />
                    ) : (
                        !!news?.data?.data?.length &&
                        news?.data?.data?.map((item: any) => (
                            <Box sx={boxStyles} key={item?.id}>
                                <div className="img-container">
                                    <img
                                        src={item?.urlImagen}
                                        alt={item?.titulo?.substring(0, 10)}
                                    />
                                </div>
                                <div className="text-container">
                                    <p>{item?.titulo}</p>
                                    <p>{item?.copete}</p>
                                </div>
                            </Box>
                        ))
                    )}
                </Carousel>
                {(!news || _.isEmpty(news)) && !loadingNews && (
                    <Box
                        className={styles['flex-center-mt']}
                        sx={{ '& p': { marginLeft: '35px' } }}
                    >
                        <p>Sin novedades.</p>
                    </Box>
                )}
            </Box>
            {!loadingNews && !!news?.data?.data && (
                <Box className={styles['flex-right']}>
                    <Button type="text" onClick={() => navigate('/agp/novedades')}>
                        Ver Más
                    </Button>
                </Box>
            )}
        </>
    );
}

export default NewsCarousel;
