import _ from 'lodash';
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Link,
    Tooltip
} from '@mui/material';
import { Fragment, ReactNode, useState } from 'react';
import { getCertificatesStates } from '../../../utils/functions';
import { useNavigate } from 'react-router-dom';
import AssemblerData from './AssemblerData';
import Button from '../../../components/button/Button';
import CloseButton from '../../../components/CloseButton';
import EditIcon from '@mui/icons-material/Edit';
import ShipEditDrawer from './shipEdition/ShipEditDrawer';
import styles from './styles.module.css';
import TenantData from './TenantData';
import useUserAccess from '../../../hooks/useUserAccess';

interface ContentProp {
    children: ReactNode;
}

function ShipsInformation({
    onClose,
    setShipFullData,
    fetchingShipById,
    shipFullData,
    parametricData,
    countries,
    showOnly,
    extraData,
    loadingShip = () => {
        return;
    },
    handleManageMenu,
    hideCertificates = false,
    callback,
    loadingShipFullData,
    selected,
    ...props
}: any) {
    const access = useUserAccess();
    const [open, setOpen] = useState<string>('');
    const navigate = useNavigate();

    const SectionTitle = ({ text, actionValue, adminCertificate }: any) => (
        <>
            {showOnly ? (
                <Box className={styles['section-title']}>
                    <h4>{text}</h4>
                </Box>
            ) : (
                <Box className={styles['section-title']}>
                    <h4>{text}</h4>
                    {!!access?.[1]?.[3] && !adminCertificate && shipFullData && !extraData && (
                        <Button
                            name={`edit_${actionValue}_section_btn`}
                            type="text"
                            onClick={() => setOpen(actionValue)}
                            endIcon={<EditIcon />}
                        >
                            Editar
                        </Button>
                    )}

                    {!!access?.[1]?.[4] && adminCertificate && shipFullData && !extraData && (
                        <Button
                            name="admin_certificates_btn"
                            type="text"
                            onClick={() =>
                                navigate(`/agp/buques/${shipFullData?.id}/certificados/asignacion`)
                            }
                            endIcon={<EditIcon />}
                        >
                            Administrar Certificados
                        </Button>
                    )}
                </Box>
            )}
        </>
    );

    const SectionData = ({ children }: ContentProp) => (
        <div className={styles['section-data']}>{children}</div>
    );

    const getCountry = (id: number) => {
        const country = countries?.find((i: any) => i.id === id);
        if (country) return country.nombre;
        else return null;
    };

    return (
        <Box className={styles['box-container']}>
            <Card variant="outlined" sx={{ height: 'inherit' }}>
                <CardContent className="right-card-information">
                    <CloseButton position="right" onClose={onClose} />
                    <SectionTitle text="Información de Buque:" actionValue="shipInfo" />
                    <SectionData>
                        {shipFullData?.id !== selected?.id || fetchingShipById ? (
                            <CircularProgress size="1.5em" color="inherit" />
                        ) : (
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    Nombre Embarcación:&nbsp;
                                    <strong>{shipFullData?.nombre || ''}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    IMO:&nbsp;
                                    <strong>{shipFullData?.imo || ''}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    Bandera:&nbsp;
                                    <strong>
                                        {showOnly
                                            ? shipFullData?.bandera
                                            : getCountry(shipFullData?.idPais) || ''}
                                    </strong>
                                </Grid>
                                <Grid item xs={12}>
                                    Matrícula:&nbsp;
                                    <strong>{shipFullData?.matricula || ''}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    Tipo Embarcación:&nbsp;
                                    <strong>{shipFullData?.tipoBuque?.nombre || ''}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    Agencia:&nbsp;
                                    <strong>{shipFullData?.agenciaMaritima?.nombre || ''}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    Señal Distintiva:&nbsp;
                                    <strong>{shipFullData?.senalDistintiva || ''}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    MMSI:&nbsp;
                                    <strong>{shipFullData?.mmsi || ''}</strong>
                                </Grid>
                                {extraData && (
                                    <Grid item xs={12}>
                                        Armador:&nbsp;
                                        <strong>{shipFullData?.armador?.nombre || ''}</strong>
                                    </Grid>
                                )}
                                {shipFullData?.estado === 'RE' && shipFullData?.nota?.nota && (
                                    <Grid item xs={12}>
                                        <Button
                                            type="text"
                                            onClick={() => handleManageMenu('show-reject-message')}
                                        >
                                            Ver nota de rechazo
                                        </Button>
                                    </Grid>
                                )}
                            </Grid>
                        )}
                    </SectionData>
                    <Divider />
                    {!extraData && (
                        <>
                            <SectionTitle
                                text="Propietario / Locatario"
                                actionValue="assemblerTenantinfo"
                            />
                            <SectionData>
                                {shipFullData?.id !== selected?.id || fetchingShipById ? (
                                    <CircularProgress size="1.5em" color="inherit" />
                                ) : (
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <AssemblerData shipFullData={shipFullData} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            {!_.isEmpty(shipFullData?.locatario) && (
                                                <TenantData shipFullData={shipFullData} />
                                            )}
                                        </Grid>
                                    </Grid>
                                )}
                            </SectionData>
                            <Divider />
                        </>
                    )}
                    <SectionTitle text="Medidas Buque:" actionValue="measurementsInfo" />
                    <SectionData>
                        {shipFullData?.id !== selected?.id || fetchingShipById ? (
                            <CircularProgress size="1.5em" color="inherit" />
                        ) : (
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    Eslora Máxima:&nbsp;
                                    <strong>{shipFullData?.esloraMaxima}</strong>
                                </Grid>
                                <Grid item xs={6}>
                                    Puntal:&nbsp;
                                    <strong>{shipFullData?.puntal}</strong>
                                </Grid>
                                <Grid item xs={6}>
                                    Manga:&nbsp;
                                    <strong>{shipFullData?.manga}</strong>
                                </Grid>
                                <Grid item xs={6}>
                                    TRB:&nbsp;
                                    <strong>{shipFullData?.trb}</strong>
                                </Grid>
                                <Grid item xs={6}>
                                    Calado Construccion:&nbsp;
                                    <strong>{shipFullData?.calado}</strong>
                                </Grid>
                                <Grid item xs={6}>
                                    Capacidad Máxima TEU:&nbsp;
                                    <strong>{shipFullData?.maximoTeus}</strong>
                                </Grid>
                                <Grid item xs={6}>
                                    Capacidad Pasajeros:&nbsp;
                                    <strong>{shipFullData?.maximoPasajeros}</strong>
                                </Grid>
                                {/* <Grid item xs={6}>
                                Calado Construcción: </strong>
                                16
                                </Grid> */}
                                <Grid item xs={6}>
                                    TRN:&nbsp;
                                    <strong>{shipFullData?.trn || ''}</strong>
                                </Grid>
                            </Grid>
                        )}
                    </SectionData>
                    <Divider />
                    {!hideCertificates && (
                        <>
                            <SectionTitle text="Certificados:" adminCertificate />
                            <SectionData>
                                {shipFullData?.id !== selected?.id || fetchingShipById ? (
                                    <CircularProgress size="1.5em" color="inherit" />
                                ) : (
                                    <Grid container spacing={1}>
                                        {_.orderBy(
                                            shipFullData?.certificados,
                                            ['tipoCertificado.id'],
                                            ['asc']
                                        )?.map((item: any, index: any) => (
                                            <Fragment key={index}>
                                                <Grid
                                                    item
                                                    xs={6}
                                                    alignItems="center"
                                                    display="flex"
                                                >
                                                    {callback && !!item?.rutaAdjunto ? (
                                                        <Tooltip
                                                            placement="top-end"
                                                            title="Descargar"
                                                        >
                                                            <Link
                                                                sx={{
                                                                    fontWeight: 500,
                                                                    cursor: 'pointer',
                                                                    color: 'var(--black)'
                                                                }}
                                                                onClick={() =>
                                                                    callback({
                                                                        certificado: item,
                                                                        buque: {
                                                                            id: shipFullData?.id,
                                                                            nombre: shipFullData?.nombre
                                                                        }
                                                                    })
                                                                }
                                                                underline="hover"
                                                            >
                                                                {item?.tipoCertificado?.nombre}
                                                            </Link>
                                                        </Tooltip>
                                                    ) : (
                                                        <>{item?.tipoCertificado?.nombre}</>
                                                    )}
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={6}
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    {getCertificatesStates(item?.estado)}
                                                </Grid>
                                            </Fragment>
                                        ))}
                                    </Grid>
                                )}
                            </SectionData>
                        </>
                    )}
                    {extraData && (
                        <>
                            <Divider />
                            <SectionTitle text="Estado de Buque:" noRender />
                            <SectionData>
                                {fetchingShipById ? (
                                    <CircularProgress size="1.5em" color="inherit" />
                                ) : (
                                    <Grid container spacing={1}>
                                        <Grid
                                            item
                                            xs={12}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center'
                                            }}
                                        >
                                            {extraData}
                                        </Grid>
                                    </Grid>
                                )}
                            </SectionData>
                        </>
                    )}
                </CardContent>
            </Card>
            <ShipEditDrawer
                open={open}
                setOpen={setOpen}
                shipFullData={shipFullData}
                parametricData={parametricData}
                setShipFullData={setShipFullData}
                countries={countries}
                {...props}
            />
        </Box>
    );
}

export default ShipsInformation;
