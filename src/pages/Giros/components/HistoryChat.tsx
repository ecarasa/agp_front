import { Box, Card, CardContent, Divider, Grid } from '@mui/material';
import { Fragment, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/button/Button';
import CloseButton from '../../../components/CloseButton';
import ConversationDetailDrawer from './ConversationDetailDrawer';
import dayjs from 'dayjs';
import Loading from '../../../components/Loading';
import styles from '../styles.module.css';

interface ContentProp {
    children: ReactNode;
}
function HistoryChat(props: any) {
    const {
        onClose,
        historyConversation,
        fetchingHistoryConversation,
        detailDrawer,
        handleOpenDetailDrawer,
        access,
        selected
    } = props;
    const navigate = useNavigate();
    const { t } = useTranslation('userForm');

    const SectionTitle = ({ text }: any) => (
        <Box className={styles['history-type']}>{text && <h4>{text}</h4>}</Box>
    );

    const SectionData = ({ children }: ContentProp) => (
        <div className={styles['section-data-cert']}>{children}</div>
    );

    return (
        <Box>
            <Card variant="outlined" sx={{ height: 'inherit' }}>
                <CardContent>
                    <CloseButton position="right" onClose={onClose} />
                    <Box className={styles['section-title']}>
                        <h4>{t('giros.titleCard')}</h4>
                        {!fetchingHistoryConversation && !!access?.[2]?.[22] && (
                            <Button
                                type="outlined"
                                onClick={() => navigate(`/agp/giros/${selected?.id}/detalle`)}
                            >
                                Detalle de Giro
                            </Button>
                        )}
                    </Box>
                    <SectionData>
                        {fetchingHistoryConversation ? (
                            <Loading size="small" />
                        ) : (
                            historyConversation?.map((item: any, index: number) => (
                                <Fragment key={index}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <SectionTitle
                                                text={`${item.tipo?.evento} - ${item.tipo?.mensaje}`}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            Desde:&nbsp;
                                            <strong>{item.remitente?.nombre}</strong>
                                        </Grid>
                                        <Grid item xs={6}>
                                            Hasta:&nbsp;
                                            <strong>{item.destinatario?.nombre}</strong>
                                        </Grid>
                                        <Grid item xs={6}>
                                            Fecha:&nbsp;
                                            <strong>
                                                {dayjs(item.fechaMensaje).format('DD/MM/YYYY')}
                                            </strong>
                                        </Grid>
                                        <Grid item xs={6}>
                                            Hora:&nbsp;
                                            <strong>
                                                {dayjs(item.fechaMensaje).format('HH:mm')}
                                            </strong>
                                        </Grid>
                                        <Grid item xs={12} sx={{ marginTop: '1rem' }}>
                                            <Button
                                                type="text"
                                                onClick={() => handleOpenDetailDrawer(item)}
                                            >
                                                Ver Detalle
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ marginTop: '1rem', margintBotton: '2rem' }} />
                                </Fragment>
                            ))
                        )}
                    </SectionData>
                </CardContent>
            </Card>
            <ConversationDetailDrawer
                open={detailDrawer}
                handleOpenDetailDrawer={handleOpenDetailDrawer}
                {...props}
            />
        </Box>
    );
}

export default HistoryChat;
