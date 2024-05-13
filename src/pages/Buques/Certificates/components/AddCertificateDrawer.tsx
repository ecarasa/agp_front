import _ from 'lodash';
import {
    Box,
    Button,
    Checkbox,
    Drawer,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import ButtonActions from '../../../../components/ButtonActions';
import CloseButton from '../../../../components/CloseButton';
import DatePickerComponent from '../../../../components/layout/DatePicker';
import Input from '../../../../components/Input/Input';
import SectionHeader from '../../../../components/SectionHeader';
import UploadIcon from '@mui/icons-material/Upload';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Loading from '../../../../components/Loading';

function AddCertificateDrawer(props: any) {
    const {
        openDrawer,
        loadedFiles,
        parametrics,
        handleUploadFile,
        handleChange,
        handleChangeFile,
        error,
        dateErrors,
        data,
        isLoading,
        certificateTypesCombo,
        setData,
        uploadingFile,
        handleCloseDrawer
    } = props;
    const { isMobile } = useIsMobile();

    return (
        <Drawer anchor="right" open={!!openDrawer} className="edition-drawer" hideBackdrop>
            <Box
                sx={{
                    marginTop: '64px',
                    width: isMobile ? '100vw' : 420,
                    height: 'auto',
                    padding: '20px',
                    '& .MuiFormControl-root': { m: '8px 0', width: '100%' }
                }}
                role="presentation"
            >
                <CloseButton position="right" onClose={handleCloseDrawer} />
                <Box
                    component="form"
                    sx={{ gap: '10px', display: 'grid' }}
                    onSubmit={(e: any) => {
                        e.preventDefault();
                        handleUploadFile();
                    }}
                >
                    <SectionHeader>
                        <SectionHeader.DrawerTitle>Nuevo Certificado</SectionHeader.DrawerTitle>
                    </SectionHeader>

                    {isLoading && !loadedFiles ? (
                        <Loading size="small" />
                    ) : (
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="demo-simple-select-label">
                                Tipo de certificado
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={data?.certificateType || ''}
                                label="Tipo de certificado"
                                name="certificateType"
                                onChange={handleChange}
                            >
                                <MenuItem value={''}>Seleccionar certificado</MenuItem>
                                {_.orderBy(certificateTypesCombo(), ['obligatorio'], ['desc'])?.map(
                                    (item: any) => (
                                        <MenuItem key={item.id} value={item}>
                                            {`${item.nombre}${item.obligatorio ? '*' : ''}`}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                    )}

                    {data?.certificateType && (
                        <>
                            {data?.certificateType?.requiereEmisor && (
                                <Box sx={{ minWidth: 120 }}>
                                    <FormControl fullWidth variant="outlined" required>
                                        <InputLabel id="demo-simple-select-label">
                                            Emisores de Certificados
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={data?.idEmisor || ''}
                                            label="Emisores de Certificados"
                                            name="idEmisor"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={''}>Seleccionar certificado</MenuItem>
                                            {parametrics?.emisoresCertificado?.map((item: any) => (
                                                <MenuItem key={item.id} value={item.id}>
                                                    {item.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            )}
                            {data?.certificateType?.requiereFechaEmision && (
                                <DatePickerComponent
                                    value={data?.fechaEmision || ''}
                                    label="Fecha de Emisión"
                                    name="fechaEmision"
                                    setValue={(value: any) =>
                                        setData({
                                            ...data,
                                            fechaEmision: value
                                        })
                                    }
                                    required
                                    disableFuture
                                />
                            )}

                            {data?.certificateType?.requiereFechaVencimiento && (
                                <DatePickerComponent
                                    required
                                    value={data?.fechaVencimiento || ''}
                                    label="Fecha de Vencimiento"
                                    name="fechaVencimiento"
                                    setValue={(value: any) =>
                                        setData({
                                            ...data,
                                            fechaVencimiento: value
                                        })
                                    }
                                    errors={dateErrors}
                                    disablePast
                                    helperText={dateErrors && dateErrors['fechaVencimiento']}
                                />
                            )}

                            {data?.certificateType?.requiereNumero === 'NU' && (
                                <Input
                                    value={data?.numero || ''}
                                    label="Número"
                                    name="numero"
                                    onChange={handleChange}
                                    required
                                />
                            )}
                            {data?.certificateType?.requiereNumero === 'PU' && (
                                <Input
                                    value={data?.puntaje || ''}
                                    label="Puntaje"
                                    name="puntaje"
                                    onChange={handleChange}
                                    required
                                />
                            )}

                            <Box
                                sx={{
                                    margin: '8px 0',
                                    fontSize: '12px',
                                    gap: '5px',
                                    display: 'grid'
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<UploadIcon />}
                                    color="inherit"
                                    fullWidth
                                    sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '5px',
                                        height: '56px',
                                        fontSize: '14px',
                                        borderColor: error ? 'red' : '#0000003b',
                                        // marginTop: '8px',
                                        justifyContent: 'flex-start'
                                    }}
                                >
                                    {data?.selectedFile
                                        ? data?.selectedFile?.name?.substring(0, 25)
                                        : 'Adjuntar Documento'}
                                    <input
                                        name="selectedFile"
                                        type="file"
                                        hidden
                                        onChange={handleChangeFile}
                                    />
                                </Button>
                                <span>&nbsp; * Archivos admitidos PDF PNG JPG JPEG</span>
                                {data?.selectedFile && (
                                    <div style={{ alignItems: 'center', display: 'inline-flex' }}>
                                        <p
                                            style={{
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {data?.selectedFile?.name}
                                        </p>
                                        <IconButton
                                            onClick={() =>
                                                setData({
                                                    ...data,
                                                    selectedFile: null
                                                })
                                            }
                                        >
                                            <HighlightOffIcon color="primary" />
                                        </IconButton>
                                    </div>
                                )}
                                {error && <span style={{ color: 'red' }}>{error}</span>}
                            </Box>
                            <FormControlLabel
                                sx={{ width: 'auto' }}
                                disabled={!!data?.selectedFile}
                                control={
                                    <Checkbox
                                        name="ddjj"
                                        value={data?.ddjj || false}
                                        checked={data?.ddjj || false}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                            handleChange(event)
                                        }
                                    />
                                }
                                label="Declaración Jurada"
                            />
                        </>
                    )}
                    <Box sx={{ margin: '40px 0' }}>
                        <ButtonActions
                            confirmText="Agregar Certificado"
                            renderBackAction
                            handleClose={handleCloseDrawer}
                            returnText="Cerrar"
                            flexDirection="column-reverse"
                            loading={uploadingFile}
                        />
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
}

export default AddCertificateDrawer;
