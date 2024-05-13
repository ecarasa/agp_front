import { Grid } from '@mui/material';
import AutocompleteComponent from '../../../../components/layout/Autocomplete';
import Input from '../../../../components/Input/Input';
import OwnerPicker from '../../components/OwnerPicker';

function AssemblerForm(props: any) {
    const {
        shipData,
        setShipData,
        isLoading,
        loadingAssemblers,
        assemblers,
        handleChange,
        getValue,
        countries,
        loadingCountries,
        assemblerCities,
        ownersData,
        handleChangeOwnersData
    } = props;

    return (
        <Grid item xs={12}>
            <Grid container spacing={3} columnSpacing={{ xs: 12, sm: 6, lg: 24 }}>
                <Grid item xs={12}>
                    <OwnerPicker
                        value="armador"
                        handleChangeOwnersData={handleChangeOwnersData}
                        ownersData={ownersData}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    {ownersData?.armador ? (
                        <Input
                            value={shipData?.armador?.nombre || ''}
                            label="Nombre"
                            name="nombre"
                            onChange={(e: any) => handleChange(e, 'armador')}
                            required
                        />
                    ) : (
                        <AutocompleteComponent
                            value={shipData?.armador}
                            name="nombre_armador"
                            label="Nombre"
                            onChange={(value: any) => {
                                handleChange(
                                    { ...(value || { value: null }), user: 'armador' },
                                    'autoselect'
                                );
                            }}
                            options={assemblers || []}
                            loading={loadingAssemblers}
                            required
                        />
                    )}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={shipData?.armador?.domicilio || ''}
                        readOnly={!!shipData?.armador?.id}
                        name="domicilio"
                        onChange={(e: any) => handleChange(e, 'armador')}
                        label="Dirección"
                        disabled={!shipData?.armador?.nombre}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AutocompleteComponent
                        value={getValue({
                            options: countries,
                            id: shipData?.armador?.idPais
                        })}
                        onChange={(value: any) => {
                            setShipData({
                                ...shipData,
                                armador: {
                                    ...shipData?.armador,
                                    idPais: value?.id
                                }
                            });
                        }}
                        name="idPais_armador"
                        readOnly={!!shipData?.armador?.id}
                        label="Pais"
                        templateLabel={(option: any) => option.nombre}
                        options={countries || []}
                        loading={loadingCountries}
                        disabled={!shipData?.armador?.nombre}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        value={shipData?.armador?.telefono || ''}
                        readOnly={!!shipData?.armador?.id}
                        name="telefono"
                        onChange={(e: any) => handleChange(e, 'armador')}
                        label="Teléfono"
                        required
                        disabled={!shipData?.armador?.nombre}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AutocompleteComponent
                        value={getValue({
                            options: assemblerCities,
                            id: shipData?.armador?.idCiudad
                        })}
                        disabled={!shipData?.armador?.idPais || !shipData?.armador?.nombre}
                        readOnly={!!shipData?.armador?.id}
                        onChange={(value: { id: number }) =>
                            setShipData({
                                ...shipData,
                                armador: {
                                    ...shipData?.armador,
                                    idCiudad: value?.id
                                }
                            })
                        }
                        name="idCiudad_armador"
                        label="Ciudad"
                        options={assemblerCities || []}
                        loading={isLoading}
                        required
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default AssemblerForm;
