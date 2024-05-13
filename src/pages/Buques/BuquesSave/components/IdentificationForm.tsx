import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AutocompleteComponent from '../../../../components/layout/Autocomplete';
import Input from '../../../../components/Input/Input';

function IdentificationForm(props: any) {
    const {
        parametricData,
        agencies,
        loadingAgencies,
        shipData,
        setShipData,
        handleChange,
        isLoading,
        getValue,
        errors,
        countries,
        perfilAM
    } = props;
    const { t } = useTranslation('userForm');

    return (
        <Grid item xs={12}>
            <Grid container spacing={3} columnSpacing={{ xs: 12, sm: 6, lg: 24 }}>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={shipData?.nombre || ''}
                        name="nombre"
                        onChange={handleChange}
                        label="Nombre del Buque"
                        required
                        errors={errors}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={shipData?.senialDistintiva || ''}
                        name="senialDistintiva"
                        onChange={handleChange}
                        label="Señal Distintiva"
                        errors={errors}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AutocompleteComponent
                        value={getValue({
                            options: parametricData?.tiposBuque,
                            id: shipData.idTipoEmbarcacion
                        })}
                        onChange={(value: { id: number }) =>
                            setShipData({
                                ...shipData,
                                idTipoEmbarcacion: value?.id
                            })
                        }
                        label="Tipo de Embarcación"
                        options={parametricData?.tiposBuque || []}
                        loading={isLoading}
                        name="idTipoEmbarcacion"
                        required
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <AutocompleteComponent
                        required
                        value={getValue({
                            options: countries,
                            id: shipData.idPais
                        })}
                        onChange={(value: { id: number }) => {
                            setShipData({
                                ...shipData,
                                idPais: value?.id
                            });
                        }}
                        label="Bandera"
                        name="idPais"
                        templateLabel={(option: any) => option.nombre}
                        options={countries || []}
                        loading={isLoading}
                        errors={errors}
                    />
                </Grid>
                <Grid container item xs={12} md={6}>
                    <Grid item xs={7} sm={8} md={7}>
                        <Input
                            value={shipData?.numeroIMO || ''}
                            name="numeroIMO"
                            onChange={handleChange}
                            label="Número de IMO"
                            required
                            errors={errors}
                            disabled={shipData?.ignoreIMO}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={5}
                        sm={4}
                        md={5}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                    >
                        <FormControlLabel
                            sx={{ width: 'auto', marginLeft: '10px' }}
                            control={
                                <Checkbox
                                    name="ignoreIMO"
                                    checked={shipData?.ignoreIMO || false}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                        handleChange(event, 'checkbox')
                                    }
                                />
                            }
                            label={t('buques.imoApply')}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={shipData?.matricula || ''}
                        name="matricula"
                        onChange={handleChange}
                        label="Matrícula"
                        required
                        errors={errors}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AutocompleteComponent
                        value={shipData.idAgenciaMaritima}
                        onChange={(value: { id: number }) =>
                            setShipData({
                                ...shipData,
                                idAgenciaMaritima: value
                            })
                        }
                        name="idAgenciaMaritima"
                        label="Agencia Marítima"
                        options={agencies || []}
                        loading={loadingAgencies}
                        disabled={perfilAM}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={shipData?.mmsi || ''}
                        name="mmsi"
                        onChange={handleChange}
                        label="MMSI"
                        errors={errors}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default IdentificationForm;
