import { useEffect, useState } from 'react';
import {
    Box,
    Checkbox,
    Drawer,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import ButtonActions from '../../../../../components/ButtonActions';
import CloseButton from '../../../../../components/CloseButton';
import DatePickerComponent from '../../../../../components/layout/DatePicker';
import dayjs from 'dayjs';
import Input from '../../../../../components/Input/Input';
import SectionHeader from '../../../../../components/SectionHeader';

function CertificateEditDrawer(props: any) {
    const {
        openEditCertificateDrawer,
        setOpenEditCertificateDrawer,
        editCertificateData,
        parametricData,
        edittingCertificate
    } = props;
    const { isMobile } = useIsMobile();
    const [data, setData] = useState<any>(null);

    const certificateType = parametricData?.tiposCertificado?.find(
        (i: any) => i.id === openEditCertificateDrawer?.item?.tipoCertificado?.id
    );

    useEffect(() => {
        if (openEditCertificateDrawer) setData(openEditCertificateDrawer?.item);
    }, [openEditCertificateDrawer]);

    return (
        <div>
            <Drawer
                anchor="right"
                open={openEditCertificateDrawer?.state}
                onClose={() => {
                    setOpenEditCertificateDrawer(null);
                }}
            >
                <Box
                    sx={{
                        marginTop: '64px',
                        width: isMobile ? '100vw' : 420,
                        height: '100%',
                        padding: '20px',
                        '& .MuiFormControl-root': { m: '8px 0', width: '100%' }
                    }}
                    role="presentation"
                >
                    <CloseButton
                        position="right"
                        onClose={() => {
                            setOpenEditCertificateDrawer(null);
                        }}
                    />
                    <Box
                        component="form"
                        onSubmit={(e: any) => {
                            e.preventDefault();
                            editCertificateData(data);
                        }}
                        sx={{ padding: '10px', gap: '10px', display: 'grid' }}
                    >
                        <SectionHeader>
                            <SectionHeader.DrawerTitle>Certificado</SectionHeader.DrawerTitle>
                        </SectionHeader>

                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Tipo de certificado</InputLabel>
                            <Select
                                labelId="certificate-edit-drawer-select"
                                label="Tipo de certificado"
                                name="certificateType"
                                value={data?.tipoCertificado?.nombre || ''}
                                disabled
                            >
                                <MenuItem value={data?.tipoCertificado?.nombre}>
                                    {data?.tipoCertificado?.nombre}
                                </MenuItem>
                            </Select>
                        </FormControl>

                        {certificateType?.requiereEmisor && (
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Emisores de Certificados</InputLabel>
                                <Select
                                    labelId="certificate-edit-drawer-emisor"
                                    value={data?.emisor?.id || ''}
                                    label="Emisores de Certificados"
                                    name="idEmisor"
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            emisor: { id: e.target.value }
                                        })
                                    }
                                >
                                    <MenuItem value={''}>Seleccionar certificado</MenuItem>
                                    {parametricData?.emisoresCertificado?.map((item: any) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        {certificateType?.requiereFechaEmision && (
                            <DatePickerComponent
                                value={dayjs(data?.fechaEmision) || dayjs(new Date())}
                                label="Fecha de Emisión"
                                name="fechaEmision"
                                setValue={(value: any) =>
                                    setData({
                                        ...data,
                                        fechaEmision: value
                                    })
                                }
                            />
                        )}

                        {certificateType?.requiereFechaVencimiento && (
                            <DatePickerComponent
                                value={dayjs(data?.fechaVencimiento) || dayjs(new Date())}
                                label="Fecha de Vencimiento"
                                name="fechaVencimiento"
                                setValue={(value: any) =>
                                    setData({
                                        ...data,
                                        fechaVencimiento: value
                                    })
                                }
                            />
                        )}

                        {certificateType?.requiereNumero === 'NU' && (
                            <Input
                                value={data?.numero || ''}
                                label="Número"
                                name="numero"
                                onChange={(e: any) =>
                                    setData({
                                        ...data,
                                        numero: e.target.value
                                    })
                                }
                                required
                                autoComplete="off"
                            />
                        )}

                        {certificateType?.requiereNumero === 'PU' && (
                            <Input
                                value={data?.puntaje || ''}
                                label="Puntaje"
                                name="puntaje"
                                onChange={(e: any) =>
                                    setData({
                                        ...data,
                                        puntaje: e.target.value
                                    })
                                }
                                required
                            />
                        )}

                        <FormControlLabel
                            sx={{ width: 'auto' }}
                            disabled
                            control={
                                <Checkbox
                                    name="ddjj"
                                    value={data?.ddjj || false}
                                    checked={data?.ddjj || false}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setData({
                                            ...data,
                                            ddjj: event.target.checked
                                        });
                                    }}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            }
                            label="Declaración Jurada"
                        />
                        <Box sx={{ margin: '40px 0' }}>
                            <ButtonActions
                                confirmText="Guardar"
                                renderBackAction
                                handleClose={() => setOpenEditCertificateDrawer(null)}
                                returnText="Cerrar"
                                flexDirection="column-reverse"
                                loading={edittingCertificate}
                            />
                        </Box>
                    </Box>
                </Box>
            </Drawer>
        </div>
    );
}

export default CertificateEditDrawer;
