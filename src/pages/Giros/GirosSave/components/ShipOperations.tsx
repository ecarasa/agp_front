import _ from 'lodash';
import {
    useGetAssemblersAndTenantsQuery,
    useGetChargeTypesQuery
} from '../../../../services/girosApi';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    TextareaAutosize
} from '@mui/material';
import { INTEGERS_UNIT } from '../../../../constants/regex';
import AutocompleteComponent from '../../../../components/layout/Autocomplete';
import AutocompleteConChips from '../../../../components/layout/SelectConChips';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Input from '../../../../components/Input/Input';
import SectionFormAccordion from '../../../../components/SectionFormAccordion/SectionFormAccordion';
import UploadIcon from '@mui/icons-material/Upload';
import WarningAlert from '../../../../components/WarningAlert';
import Loading from '../../../../components/Loading';

function ShipOperations(props: any) {
    const { data, setData, errors, handleChangeFile, handleChange, teuValidation, uploadingFiles } =
        props;
    const { data: assemblersAndTenants, isLoading: loadingassemAndTent } =
        useGetAssemblersAndTenantsQuery();
    const { data: chargeTypes, isLoading: loadingChargeTypes } = useGetChargeTypesQuery();

    return (
        <>
            <SectionFormAccordion title="Información General">
                <Grid item xs={12}>
                    <Input value={data?.buque?.agenciaMaritima?.nombre} label="Agencia" readOnly />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input value={data?.buque?.armador?.nombre} label="Propietario" readOnly />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AutocompleteConChips
                        options={
                            assemblersAndTenants?.filter(
                                (i: any) => i.id !== data?.buque?.armador?.id
                            ) || []
                        }
                        width="100%"
                        label="Carga compartida con Propietarios"
                        value={data?.idArmadores || []}
                        setValue={(value: any) => {
                            handleChange({
                                target: { name: 'idArmadores', value: [...value] }
                            });
                        }}
                        loading={loadingassemAndTent}
                        name="carga_compartida"
                    />
                </Grid>
            </SectionFormAccordion>
            <SectionFormAccordion title="Operacion del Buque">
                {teuValidation() && (
                    <Grid item xs={12}>
                        <WarningAlert>
                            Los TEU definidos deben ser iguales o inferiores a los TEU
                            correspondientes al buque.
                        </WarningAlert>
                    </Grid>
                )}
                <Grid item xs={12} sm={6}>
                    <Input
                        label="TEU a Desembarcar"
                        name="teuDesembarcar"
                        value={data?.teuDesembarcar || ''}
                        onChange={(e: any) => {
                            let value = e.target.value;
                            if (
                                (INTEGERS_UNIT.test(value) || value === '' || value === 0) &&
                                value?.length < 6
                            ) {
                                handleChange({
                                    target: { name: 'teuDesembarcar', value: value }
                                });
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        label="TEU a Embarcar"
                        name="teuEmbarcar"
                        value={data?.teuEmbarcar || ''}
                        onChange={(e: any) => {
                            let value = e.target.value;
                            if (
                                (INTEGERS_UNIT.test(value) || value === '' || value === 0) &&
                                value?.length < 6
                            ) {
                                handleChange({
                                    target: { name: 'teuEmbarcar', value: value }
                                });
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AutocompleteComponent
                        value={data?.idTipoCargaDesembarcar}
                        onChange={(value: any) => {
                            handleChange({
                                target: {
                                    name: 'idTipoCargaDesembarcar',
                                    value: value
                                }
                            });
                        }}
                        name="carga_desembarcar"
                        label="Seleccione Carga a Desembarcar"
                        options={chargeTypes || []}
                        loading={loadingChargeTypes}
                        required={!!data?.teuDesembarcar}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AutocompleteComponent
                        value={data?.idTipoCargaEmbarcar}
                        onChange={(value: any) =>
                            handleChange({
                                target: {
                                    name: 'idTipoCargaEmbarcar',
                                    value: value
                                }
                            })
                        }
                        name="carga_embarcar"
                        label="Seleccione Carga a Embarcar"
                        options={chargeTypes || []}
                        loading={loadingChargeTypes}
                        required={!!data?.teuEmbarcar}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
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
                            aria-label="selectedFiles"
                            sx={{
                                textTransform: 'capitalize',
                                borderRadius: '10px',
                                height: '56px',
                                fontSize: '14px',
                                borderColor:
                                    errors && errors['selectedFiles'] ? 'red' : '#0000003b',
                                marginTop: '8px',
                                justifyContent: 'flex-start'
                            }}
                        >
                            {data?.selectedFile
                                ? data?.selectedFile?.name?.substring(0, 25)
                                : `Adjuntar Documento${data?.contieneMmpp ? '*' : ''}`}
                            <input
                                name="selectedFile"
                                type="file"
                                hidden
                                onChange={handleChangeFile}
                            />
                        </Button>
                        <span>
                            &nbsp; * Archivos admitidos PDF PNG JPG JPEG.{' '}
                            {errors && (
                                <span style={{ color: 'red' }}>{errors?.selectedFiles}</span>
                            )}
                        </span>
                        {data?.selectedFiles?.map((file: any, index: number) => (
                            <div
                                key={index}
                                style={{ alignItems: 'center', display: 'inline-flex' }}
                            >
                                <p
                                    style={{
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {file?.name}
                                </p>
                                <IconButton
                                    onClick={() => {
                                        let newArray = [...data?.selectedFiles];
                                        _.remove(newArray, { name: file?.name });
                                        setData({
                                            ...data,
                                            selectedFiles: newArray
                                        });
                                    }}
                                >
                                    <HighlightOffIcon color="primary" />
                                </IconButton>
                                {uploadingFiles && <Loading size="extrasmall" />}
                            </div>
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <FormControlLabel
                        label="Mercaderías Peligrosas"
                        sx={{ width: 'auto', marginLeft: '10px' }}
                        value={data?.contieneMmpp}
                        control={
                            <Checkbox
                                name="contieneMmpp"
                                checked={data?.contieneMmpp || false}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                    handleChange(event, 'checkbox')
                                }
                            />
                        }
                    />
                    <FormControlLabel
                        label="Servicios a la Nave"
                        sx={{ width: 'auto', marginLeft: '10px' }}
                        value={data?.requiereServicios}
                        control={
                            <Checkbox
                                name="requiereServicios"
                                checked={data?.requiereServicios || false}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                    handleChange(event, 'checkbox')
                                }
                            />
                        }
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextareaAutosize
                        placeholder="Escriba una nota"
                        minRows={3}
                        maxRows={10}
                        name="nota"
                        onChange={handleChange}
                        value={data?.nota}
                    />
                </Grid>
            </SectionFormAccordion>
        </>
    );
}

export default ShipOperations;
