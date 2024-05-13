import { ReactNode, useState } from 'react';
import { CircularProgress, Divider, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CloseButton from '../../../components/CloseButton';
import EditIcon from '@mui/icons-material/Edit';
import styles from './styles.module.css';
import EmpresaEditDrawer from './EmpresaEditDrawer';
import ButtonActions from '../../../components/ButtonActions';

interface ContentProp {
    children: ReactNode;
}

const EmpresaInformation = ({
    loadingCompanyById,
    fetchingCompanyById,
    access,
    onClose,
    companyById,
    cambioEstado,
    edittingCompanyState,
    ...props
}: any) => {
    const [open, setOpen] = useState<string>('');
    const handleClickEdit = (actionValue: string) => {
        setOpen(actionValue);
    };

    const SectionTitle = ({ text, actionValue, noRender }: any) => (
        <Box className={styles['section-title']}>
            <h4>{text}</h4>
            {!!access?.[7]?.[43] && !noRender && (
                <Button
                    name={`edit_${actionValue}_section_btn`}
                    variant="text"
                    onClick={() => handleClickEdit(actionValue)}
                >
                    Editar <EditIcon />
                </Button>
            )}
        </Box>
    );

    const SectionData = ({ children }: ContentProp) => (
        <div className={styles['section-data']}>{children}</div>
    );

    return (
        <Box className={styles['box-container']}>
            <Card variant="outlined" sx={{ height: 'inherit', borderRadius: '12px' }}>
                <CardContent className="right-card-information">
                    <CloseButton position="right" onClose={onClose} />
                    <SectionTitle text="Información de empresa" actionValue="companyInfo" />
                    <SectionData>
                        {loadingCompanyById || fetchingCompanyById ? (
                            <CircularProgress size="1.5em" color="inherit" />
                        ) : (
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    Nombre Empresa:&nbsp;
                                    <strong>{companyById?.nombre || 'N/A'}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    Nombre Comercial:&nbsp;
                                    <strong>{companyById?.nombreComercial || 'N/A'}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    Identificación Fiscal:&nbsp;
                                    <strong>{companyById?.identificacionFiscal || 'N/A'}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    Categoría Fiscal:&nbsp;
                                    <strong>{companyById?.categoriaFiscal?.nombre || 'N/A'}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    Domicilio:&nbsp;
                                    <strong>{companyById?.domicilio || 'N/A'}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    País:&nbsp;
                                    <strong>{companyById?.pais.nombre || 'N/A'}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    Ciudad:&nbsp;
                                    <strong>{companyById?.ciudad?.nombre || 'N/A'}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    Mail:&nbsp;
                                    <strong>{companyById?.email || 'N/A'}</strong>
                                </Grid>
                                <Grid item xs={12}>
                                    Telefono:&nbsp;
                                    <strong>{companyById?.telefono || 'N/A'}</strong>
                                </Grid>
                            </Grid>
                        )}
                    </SectionData>
                    <Divider />
                    <Divider />
                    <SectionTitle text="Asignaciones" actionValue="rolesCompanyInfo" />
                    <SectionData>
                        {loadingCompanyById || fetchingCompanyById ? (
                            <CircularProgress size="1.5em" color="inherit" />
                        ) : (
                            <>
                                <h3>Perfiles</h3>
                                <Grid container xs={12} item sm direction="row">
                                    <Grid xs={12} item container direction="column">
                                        {companyById &&
                                            companyById.perfiles?.map(
                                                (items: any, index: number) => (
                                                    <Grid item key={index}>
                                                        {items.nombre}
                                                    </Grid>
                                                )
                                            )}
                                    </Grid>
                                </Grid>
                                <h3>Organizaciones</h3>
                                <Grid container xs={12} item sm direction="row">
                                    <Grid xs={12} item container direction="column">
                                        {companyById &&
                                            companyById.organizaciones?.map(
                                                (items: any, index: number) => (
                                                    <Grid item key={index}>
                                                        {items.nombre}
                                                    </Grid>
                                                )
                                            )}
                                    </Grid>
                                </Grid>
                                <Box sx={{ mt: 4 }}>
                                    <ButtonActions
                                        variant="outlined"
                                        loading={edittingCompanyState}
                                        confirmText={
                                            !companyById?.activo ? 'Activar' : 'Desactivar'
                                        }
                                        onClick={(event: any) => cambioEstado(event)}
                                    />
                                </Box>
                            </>
                        )}
                    </SectionData>
                </CardContent>
            </Card>
            <EmpresaEditDrawer open={open} setOpen={setOpen} companyById={companyById} {...props} />
        </Box>
    );
};

export default EmpresaInformation;
