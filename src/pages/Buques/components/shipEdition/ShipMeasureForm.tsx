import { Box } from '@mui/material';
import { INTEGERS_UNIT } from '../../../../constants/regex';
import ButtonActions from '../../../../components/ButtonActions';
import Input from '../../../../components/Input/Input';
import SectionHeader from '../../../../components/SectionHeader';
import useEditShip from './hooks/useEditShip';

function ShipMeasureInfo({ setOpen, open, shipFullData }: any) {
    const { shipDimensions, handleChangeDimensions, handleSubmit, submitingData, getDisableState } =
        useEditShip({
            shipFullData,
            open
        });

    return (
        <>
            <SectionHeader>
                <SectionHeader.DrawerTitle>Dimensiones de Buque</SectionHeader.DrawerTitle>
            </SectionHeader>
            <Box
                component="form"
                onSubmit={(e: any) => {
                    e.preventDefault();
                    handleSubmit(setOpen, 'dimensions');
                }}
                sx={{ padding: '10px' }}
                mb={3}
            >
                <Input
                    name="esloraMaxima"
                    label="Eslora Máxima"
                    value={shipDimensions?.esloraMaxima || ''}
                    onChange={handleChangeDimensions}
                />
                <Input
                    name="manga"
                    label="Manga"
                    value={shipDimensions?.manga || ''}
                    onChange={handleChangeDimensions}
                />
                <Input
                    name="puntal"
                    label="Puntal"
                    value={shipDimensions?.puntal || ''}
                    onChange={handleChangeDimensions}
                />
                <Input
                    name="capacidadMaximaTEU"
                    label="Capacidad Máxima TEU"
                    value={shipDimensions?.capacidadMaximaTEU || 0}
                    onChange={(e: any) => {
                        let value = e.target.value;
                        if ((INTEGERS_UNIT.test(value) || value === '') && value?.length < 6) {
                            handleChangeDimensions({
                                target: {
                                    name: 'capacidadMaximaTEU',
                                    value: value
                                }
                            });
                        }
                    }}
                />
                <Input
                    name="capacidadMaximaPasajeros"
                    label="Capacidad Pasajeros"
                    value={shipDimensions?.capacidadMaximaPasajeros || 0}
                    onChange={(e: any) => {
                        let value = e.target.value;
                        if ((INTEGERS_UNIT.test(value) || value === '') && value?.length < 6) {
                            handleChangeDimensions({
                                target: {
                                    name: 'capacidadMaximaPasajeros',
                                    value: value
                                }
                            });
                        }
                    }}
                />
                <Input
                    name="caladoConstruccion"
                    label="Calado Construcción"
                    value={shipDimensions?.caladoConstruccion || ''}
                    onChange={handleChangeDimensions}
                />
                <Input
                    name="trn"
                    label="TRN"
                    value={shipDimensions?.trn || ''}
                    onChange={handleChangeDimensions}
                />
                <Input
                    name="trb"
                    label="TRB"
                    value={shipDimensions?.trb || ''}
                    onChange={handleChangeDimensions}
                />

                <Box sx={{ margin: '40px 0' }}>
                    <ButtonActions
                        disabled={getDisableState()}
                        confirmText="Aceptar"
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

export default ShipMeasureInfo;
