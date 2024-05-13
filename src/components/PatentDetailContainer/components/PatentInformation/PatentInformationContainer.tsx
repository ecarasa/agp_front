import _ from 'lodash';
import { Card, CardContent, Grid } from '@mui/material';
import { QUARTER_PERIOD_FULL } from '../../../../commons/States';
import { useNavigate } from 'react-router-dom';
import Button from '../../../button/Button';
import Input from '../../../Input/Input';
import Loading from '../../../Loading';
import patentstyles from '../../patentstyles.module.css';
import PlacementsCard from './PlacementsCard';
import styles from '../../../GiroDetailContainer/style.module.css';

function PatentInformationContainer(props: any) {
    const {
        data,
        loadingPatent,
        fetchingPatent,
        loadingAnswers,
        availableAnswers,
        handleConfirmAction,
        handleLogMovement,
        isNavi,
        ...restProps
    } = props;

    const navigate = useNavigate();

    const actionButtons = (id: number) => {
        switch (id) {
            case 17:
                return (
                    <div className={styles['btn-dng']} key={id}>
                        <Button type="outlined" onClick={() => handleConfirmAction(id)}>
                            Cancelar patente
                        </Button>
                    </div>
                );
            case 18:
                return (
                    <Button
                        key={id}
                        onClick={() => handleConfirmAction(id)}
                        // disabled={!validateIsEqual()}
                    >
                        Aprobar
                    </Button>
                );
            case 19:
                return (
                    <div className={styles['btn-dng']} key={id}>
                        <Button type="outlined" onClick={() => handleConfirmAction(id)}>
                            Denegar
                        </Button>
                    </div>
                );
            case 20:
                return (
                    <div className={styles['btn-dng']} key={id}>
                        <Button type="outlined" onClick={() => handleConfirmAction(id)}>
                            Rechazar
                        </Button>
                    </div>
                );

            default:
                return <></>;
        }
    };

    return (
        <>
            <Grid container spacing={2}>
                {loadingPatent || fetchingPatent ? (
                    <Loading size="small" />
                ) : (
                    !_.isEmpty(data) && (
                        <>
                            <Grid item xs={12}>
                                <strong>Información general de la patente</strong>
                            </Grid>
                            <Grid item xs={12} mb={4}>
                                <Card className="card-ship-operations">
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                Trimestre:
                                            </Grid>
                                            <Grid item xs={6}>
                                                <b>
                                                    {
                                                        QUARTER_PERIOD_FULL[
                                                            data?.ultimoPeriodo?.trimestre
                                                        ]
                                                    }
                                                </b>
                                            </Grid>
                                            <Grid item xs={6}>
                                                Año:
                                            </Grid>
                                            <Grid item xs={6}>
                                                <b>{data?.ultimoPeriodo?.anio}</b>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Input
                                                    label="Nota"
                                                    size="small"
                                                    readOnly
                                                    value={data?.nota || ''}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <strong>Terminal / Muelle</strong>
                            </Grid>
                            {isNavi && (
                                <Grid item xs={6} textAlign="right" className="strong-btn">
                                    <Button type="text" onClick={() => navigate(`movimientos`)}>
                                        Ver detalle
                                    </Button>
                                </Grid>
                            )}
                            {_.orderBy(data?.movimientos, ['muelle.terminal.sigla', 'asc'])?.map(
                                (item: any) => (
                                    <PlacementsCard
                                        item={item}
                                        key={item?.id}
                                        handleLogMovement={handleLogMovement}
                                        isNavi={isNavi}
                                    />
                                )
                            )}
                        </>
                    )
                )}

                {isNavi && !loadingPatent && !fetchingPatent && (
                    <Grid
                        item
                        xs={12}
                        className={`flex-center ${patentstyles['add-operation-button']}`}
                    >
                        <Button onClick={handleLogMovement}>Nuevo registro</Button>
                    </Grid>
                )}

                {!isNavi && (
                    <Grid item xs={12} className={styles['grid-button-container']}>
                        {loadingAnswers || loadingPatent || fetchingPatent ? (
                            <Loading size="small" />
                        ) : (
                            _.orderBy(availableAnswers, ['id'], ['asc'])?.map((item: any) =>
                                actionButtons(item.id)
                            )
                        )}
                    </Grid>
                )}

                {!loadingPatent && !fetchingPatent && !data && (
                    <Grid item xs={12}>
                        <p>No se pudo cargar información.</p>
                    </Grid>
                )}
            </Grid>
        </>
    );
}

export default PatentInformationContainer;
