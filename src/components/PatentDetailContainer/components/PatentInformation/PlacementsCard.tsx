import { Card, CardContent, Grid, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import styles from '../../patentstyles.module.css';

function PlacementsCard({ item, handleLogMovement, isNavi }: any) {
    return (
        <Grid item xs={12} key={item?.id}>
            <Card className={`card-ship-operations ${isNavi ? styles['patent-navi-card'] : ''}`}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={10} xl={11}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    Terminal:
                                </Grid>
                                <Grid item xs={6}>
                                    Muelle:
                                </Grid>
                                <Grid item xs={6}>
                                    <b>{item?.muelle?.terminal?.sigla}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    <b>{item?.muelle?.nombre}</b>
                                </Grid>
                            </Grid>
                        </Grid>
                        {isNavi && (
                            <Grid item xs={2} xl={1} className={styles['operations-log-button']}>
                                <Tooltip title="Agregar nueva operación" placement="top">
                                    <IconButton onClick={() => handleLogMovement(item)}>
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    );
}

export default PlacementsCard;
