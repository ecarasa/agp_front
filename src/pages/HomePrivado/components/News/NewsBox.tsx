import { Box, Grid } from '@mui/material';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import Button from '../../../../components/button/Button';
import Loading from '../../../../components/Loading';
import NewsCard from './NewsCard';

const BoxStyles = {
    maxWidth: 1200,
    display: 'block',
    margin: '2% auto',
    '& table thead tr': {
        height: '0px !important'
    },
    '& table thead tr th': {
        background: 'transparent !important'
    },
    '& table tbody': {
        fontSize: '17px'
    }
};

function NewsBox(props: any) {
    const { loadingNews, items, setSelectedItem, news, handleLoadMore, fetchingNews } = props;
    const { isMobile } = useIsMobile();
    return (
        <Box sx={BoxStyles}>
            <h2>Novedades</h2>

            <Grid container spacing={3}>
                {loadingNews ? (
                    <Loading size="small" />
                ) : (
                    items?.map((item: any) => (
                        <Grid
                            xs={12}
                            sm={6}
                            md={4}
                            item
                            key={item?.id}
                            className={isMobile ? 'flex-center' : ''}
                        >
                            <NewsCard item={item} setSelectedItem={setSelectedItem} />
                        </Grid>
                    ))
                )}
                {!!news?.data?.data?.length && (
                    <Grid item xs={12} className="flex-center">
                        <Button type="text" onClick={handleLoadMore} loading={fetchingNews}>
                            Cargar más
                        </Button>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}

export default NewsBox;
