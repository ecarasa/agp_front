import { Fragment, ReactNode } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    Divider,
    Grid,
    Tooltip
} from '@mui/material';
import _ from 'lodash';
import { CERTIFICATE_STATES } from '../../../../commons/States';
import { FILE_EXTENSION } from '../../../../constants/regex';
import { selectCurrentUser } from '../../../../features/auth/authSlice';
import { stateIcons } from '../../BuquesIndex';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import CertificateEditDrawer from './components/CertificateEditDrawer';
import CloseButton from '../../../../components/CloseButton';
import dayjs from 'dayjs';
import RejectNoteDrawer from './components/RejectNoteDrawer';
import styles from '../styles.module.css';

interface ContentProp {
    children: ReactNode;
}
const CertificatesInfoCard = ({
    edittingCertificate,
    downloadDocument,
    setShipFullData,
    setOpenCertificatesCard,
    gettingCertificates,
    shipFullData,
    certificatesError,
    parametricData,
    shipCertificates,
    handleEditCertificate,
    setOpenCertificateNoteDrawer,
    setItemSelected,
    downloadingFile,
    isLoading,
    openCertificateNoteDrawer,
    handleChangeRejectCertificate,
    handleRejectCertificate,
    access,
    ...props
}: any) => {
    const user = useAppSelector(selectCurrentUser);
    const isAgency = user?.empresa?.tienePerfilAgenciaMaritima;
    const SectionData = ({ children }: ContentProp) => (
        <div className={styles['section-data-cert']}>{children}</div>
    );

    return (
        <Box className={styles['box-container']}>
            <Card variant="outlined" sx={{ height: 'inherit' }}>
                <CardContent>
                    <CloseButton
                        position="right"
                        onClose={() => {
                            setItemSelected(null);
                            setOpenCertificatesCard(false);
                        }}
                    />
                    <Box className={styles['section-title']}>
                        <h4>{isAgency ? 'Certificados' : 'Aprobación/Rechazo de Certificados'}</h4>
                    </Box>
                    <SectionData>
                        {gettingCertificates || isLoading ? (
                            <Grid container sx={{ margin: '10px 0' }}>
                                <CircularProgress size="1.5em" color="inherit" />
                            </Grid>
                        ) : !shipCertificates?.length ? (
                            <Grid container>
                                <p>
                                    {certificatesError
                                        ? 'Error al solicitar información.'
                                        : 'No existen certificados cargados.'}
                                </p>
                            </Grid>
                        ) : (
                            _.orderBy(shipCertificates, ['tipoCertificado.id'], ['asc'])?.map(
                                (item: any, index: number) => (
                                    <Fragment key={index}>
                                        <Grid container spacing={1} mb={2} mt={2} key={index}>
                                            <Grid item xs={6}>
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sx={{
                                                            overflow: 'hidden',
                                                            whiteSpace: 'nowrap',
                                                            textOverflow: 'ellipsis'
                                                        }}
                                                    >
                                                        <Tooltip
                                                            placement="top-start"
                                                            title={item?.tipoCertificado?.nombre}
                                                        >
                                                            <span className="certificate-overflow-name">
                                                                {item?.tipoCertificado?.nombre}
                                                            </span>
                                                        </Tooltip>
                                                    </Grid>

                                                    <Grid
                                                        item
                                                        xs={!isAgency ? 12 : 6}
                                                        sx={{ fontSize: '11px' }}
                                                    >
                                                        <Checkbox
                                                            checked={item?.ddjj}
                                                            disabled
                                                            sx={{
                                                                padding: '0 4px 0 0',
                                                                '& .MuiSvgIcon-root': {
                                                                    fontSize: 16
                                                                }
                                                            }}
                                                        />
                                                        Declaración Jurada
                                                    </Grid>
                                                    <Grid item xs={12} sx={{ fontSize: '11px' }}>
                                                        {item?.puntaje ? (
                                                            <>
                                                                Puntaje:&nbsp;
                                                                <strong>{item?.puntaje}</strong>
                                                            </>
                                                        ) : (
                                                            <>
                                                                Número:&nbsp;
                                                                <strong>{item?.numero}</strong>
                                                            </>
                                                        )}
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        onClick={() => {
                                                            if (item?.ddjj) return;
                                                            downloadDocument(item);
                                                        }}
                                                        xs={12}
                                                        sx={{
                                                            fontSize: '14px',
                                                            cursor: 'pointer',
                                                            '& span:active': {
                                                                textDecoration: 'none'
                                                            },
                                                            '& span': {
                                                                textDecoration: 'underline'
                                                            }
                                                        }}
                                                    >
                                                        {item?.rutaAdjunto ? (
                                                            <Tooltip
                                                                title="Descargar certificado"
                                                                placement="top-start"
                                                            >
                                                                <span>
                                                                    {`Adjunto${
                                                                        item?.rutaAdjunto?.match(
                                                                            FILE_EXTENSION
                                                                        )?.[0] || ''
                                                                    }`}
                                                                    {downloadingFile?.id ===
                                                                        item?.id && (
                                                                        <CircularProgress
                                                                            sx={{ margin: '0 5px' }}
                                                                            size="0.8em"
                                                                            color="inherit"
                                                                        />
                                                                    )}
                                                                </span>
                                                            </Tooltip>
                                                        ) : (
                                                            <>Con DDJJ</>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Grid
                                                    container
                                                    spacing={2}
                                                    sx={{ paddingLeft: '2px' }}
                                                >
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sx={{
                                                            display: 'flex',
                                                            aligItems: 'center',
                                                            justifyContent: edittingCertificate
                                                                ? 'center'
                                                                : 'flex-end'
                                                        }}
                                                    >
                                                        {edittingCertificate ? (
                                                            <CircularProgress
                                                                size="1.5em"
                                                                color="inherit"
                                                            />
                                                        ) : (
                                                            <>
                                                                {stateIcons(item?.estado)}&nbsp;
                                                                {CERTIFICATE_STATES[item?.estado]}
                                                            </>
                                                        )}
                                                    </Grid>
                                                    <Grid item xs={12} sx={{ fontSize: '11px' }}>
                                                        <span>Fecha Emisión:&nbsp;</span>
                                                        <strong>
                                                            {item?.fechaEmision
                                                                ? dayjs(item?.fechaEmision).format(
                                                                      'DD/MM/YYYY'
                                                                  )
                                                                : 'N/A'}
                                                        </strong>
                                                    </Grid>
                                                    <Grid item xs={12} sx={{ fontSize: '11px' }}>
                                                        <span>Fecha Vencimiento:&nbsp;</span>

                                                        <strong>
                                                            {item?.fechaVencimiento
                                                                ? dayjs(
                                                                      item?.fechaVencimiento
                                                                  ).format('DD/MM/YYYY')
                                                                : 'N/A'}
                                                        </strong>
                                                    </Grid>

                                                    <Grid
                                                        item
                                                        xs={12}
                                                        style={{
                                                            fontSize: '14px',
                                                            textTransform: 'capitalize',
                                                            cursor: 'pointer',
                                                            textAlign: 'center',
                                                            gap: '15px',
                                                            color: 'var(--primary)',
                                                            paddingLeft: 0
                                                        }}
                                                    >
                                                        <Button
                                                            onClick={() =>
                                                                handleEditCertificate('edit', item)
                                                            }
                                                            disabled={
                                                                item?.estado !== 'PE' &&
                                                                !access?.[1]?.[4]
                                                            }
                                                            sx={{
                                                                padding: 0,
                                                                textTransform: 'capitalize'
                                                            }}
                                                            size="small"
                                                        >
                                                            Editar
                                                        </Button>

                                                        {!isAgency && (
                                                            <Button
                                                                onClick={() => {
                                                                    handleEditCertificate(
                                                                        'approve',
                                                                        item
                                                                    );
                                                                }}
                                                                disabled={
                                                                    ['RE', 'AP'].includes(
                                                                        item?.estado
                                                                    ) ||
                                                                    !access?.[1]?.[5] ||
                                                                    shipFullData?.estado === 'BO' ||
                                                                    item?.estado === 'VE'
                                                                }
                                                                sx={{
                                                                    padding: 0,
                                                                    textTransform: 'capitalize'
                                                                }}
                                                                size="small"
                                                            >
                                                                Aprobar
                                                            </Button>
                                                        )}

                                                        {((isAgency && item?.estado === 'RE') ||
                                                            (!isAgency && item?.nota)) && (
                                                            <Button
                                                                disabled={
                                                                    ((!access?.[1]?.[5] ||
                                                                        shipFullData?.estado ===
                                                                            'BO') &&
                                                                        item?.estado !== 'RE') ||
                                                                    ['VE', 'AP'].includes(
                                                                        item?.estado
                                                                    )
                                                                }
                                                                onClick={() =>
                                                                    handleEditCertificate(
                                                                        'reject',
                                                                        item
                                                                    )
                                                                }
                                                                sx={{
                                                                    padding: 0,
                                                                    textTransform: 'capitalize'
                                                                }}
                                                                size="small"
                                                            >
                                                                {item?.estado === 'RE'
                                                                    ? 'Ver nota'
                                                                    : 'Rechazar'}
                                                            </Button>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Divider />
                                    </Fragment>
                                )
                            )
                        )}
                        <Divider />
                    </SectionData>
                </CardContent>
            </Card>
            <CertificateEditDrawer
                shipFullData={shipFullData}
                parametricData={parametricData}
                setShipFullData={setShipFullData}
                edittingCertificate={edittingCertificate}
                {...props}
            />
            <RejectNoteDrawer
                data={openCertificateNoteDrawer}
                setOpen={setOpenCertificateNoteDrawer}
                shipFullData={shipFullData}
                setShipFullData={setShipFullData}
                handleRejectCertificate={handleRejectCertificate}
                handleChangeRejectCertificate={handleChangeRejectCertificate}
            />
        </Box>
    );
};

export default CertificatesInfoCard;
