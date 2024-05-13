import { Box } from '@mui/material';
import Input from '../../../../components/Input/Input';
import useEditShips from './hooks/useEditShip';
import ButtonActions from '../../../../components/ButtonActions';
import AutocompleteComponent from '../../../../components/layout/Autocomplete';
import SectionHeader from '../../../../components/SectionHeader';

function ShipInfoForm({ setOpen, agencies, shipFullData, open, parametricData, countries }: any) {
    const { shipInfo, handleChangeShipInfo, handleSubmit, errors, getDisableState, submitingData } =
        useEditShips({
            shipFullData,
            open
        });

    return (
        <>
            <SectionHeader>
                <SectionHeader.DrawerTitle>Información de Buque</SectionHeader.DrawerTitle>
            </SectionHeader>
            <Box
                component="form"
                onSubmit={(e: any) => {
                    e.preventDefault();
                    handleSubmit(setOpen, 'info');
                }}
                sx={{ padding: '10px' }}
            >
                <Input
                    value={shipInfo?.nombre || ''}
                    name="nombre"
                    label="Nombre Embarcación"
                    onChange={handleChangeShipInfo}
                    errors={errors}
                />
                <Input
                    value={shipInfo?.numeroIMO || ''}
                    name="numeroIMO"
                    label="IMO"
                    onChange={handleChangeShipInfo}
                    errors={errors}
                />
                <AutocompleteComponent
                    value={countries.find((i: any) => i.id === shipInfo?.idPais)}
                    onChange={(value: { id: number }) => {
                        handleChangeShipInfo({
                            target: {
                                name: 'idPais',
                                value: value?.id
                            }
                        });
                    }}
                    label="Bandera"
                    name="bandera"
                    errors={errors}
                    templateLabel={(option: any) => option.nombre}
                    options={countries || []}
                />
                <Input
                    value={shipInfo?.matricula || ''}
                    name="matricula"
                    label="Matrícula"
                    onChange={handleChangeShipInfo}
                    errors={errors}
                />
                <AutocompleteComponent
                    value={shipInfo?.idTipoEmbarcacion}
                    onChange={(value: any) =>
                        handleChangeShipInfo({
                            target: {
                                name: 'idTipoEmbarcacion',
                                value: value
                            }
                        })
                    }
                    label="Tipo de Embarcación"
                    options={parametricData?.tiposBuque || []}
                />
                <AutocompleteComponent
                    value={shipInfo?.idAgenciaMaritima}
                    onChange={(value: any) =>
                        handleChangeShipInfo({
                            target: {
                                name: 'idAgenciaMaritima',
                                value: value
                            }
                        })
                    }
                    label="Agencia Marítima"
                    options={agencies || []}
                />
                <Input
                    value={shipInfo?.senialDistintiva || ''}
                    name="senialDistintiva"
                    label="Señal Distintiva"
                    onChange={handleChangeShipInfo}
                />
                <Input
                    value={shipInfo?.mmsi || ''}
                    name="mmsi"
                    label="MMSI"
                    onChange={handleChangeShipInfo}
                />

                <Box sx={{ margin: '40px 0' }}>
                    <ButtonActions
                        disabled={getDisableState()}
                        renderBackAction
                        handleClose={() => setOpen(false)}
                        returnText="Cerrar"
                        flexDirection="column-reverse"
                        loading={submitingData}
                    />
                </Box>
            </Box>
        </>
    );
}

export default ShipInfoForm;
