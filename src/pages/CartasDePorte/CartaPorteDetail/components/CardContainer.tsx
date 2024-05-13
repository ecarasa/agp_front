import { Card, CardContent, Grid, capitalize } from '@mui/material';
import Loading from '../../../../components/Loading';

type CardProps = {
    title: string;
    data: any;
};
function CardContainer({ title, data }: CardProps) {
    return (
        <>
            <Card className="card-container">
                <CardContent>
                    {false ? (
                        <Loading size="small" />
                    ) : (
                        <>
                            <p className="info-card-title">{capitalize(title)}</p>
                            <Grid container spacing={2} sx={{ padding: '16px' }}>
                                <Grid item xs={6}>
                                    Razón Social:
                                </Grid>
                                <Grid item xs={6}>
                                    <b>{data[title]?.nombre || 'N/A'}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    Localidad:
                                </Grid>
                                <Grid item xs={6}>
                                    <b>{data?.[title]?.ciudad?.nombre || 'N/A'}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    CUIT:
                                </Grid>
                                <Grid item xs={6}>
                                    <b>{data?.[title]?.identificacionFiscal || 'N/A'}</b>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

export default CardContainer;
