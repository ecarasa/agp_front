import { Grid } from '@mui/material';
import { INTEGERS_UNIT } from '../../../../constants/regex';
import ButtonActions from '../../../../components/ButtonActions';
import DrawerContainer from '../../../../components/DrawerContainer';
import Input from '../../../../components/Input/Input';
import useAssignment from '../hooks/useAssignment';
import WarningAlert from '../../../../components/WarningAlert';

function WaybillAssignmentDrawer(props: any) {
    const { cartaPorte, data, handleChange, handleCloseDrawer, searchInput } = props;
    const { handleChangeWaybill, waybillData, clearDrawerInputs } = useAssignment();

    const railwayValidation = cartaPorte?.ferrocarril?.id !== data?.idFerrocarril;

    return (
        <DrawerContainer title="Detalle de Carta de Porte" {...props}>
            <Grid container spacing={2} p={1}>
                {railwayValidation && (
                    <Grid item xs={12}>
                        <WarningAlert>
                            El ferrocarril de la carta de porte no corresponde al ferrocarril
                            seleccionado en paso anterior.
                        </WarningAlert>
                    </Grid>
                )}
                <Grid item xs={6}>
                    Nro Carta de Porte:
                </Grid>
                <Grid item xs={6}>
                    <b>{cartaPorte?.numero}</b>
                </Grid>
                <Grid item xs={6}>
                    Agente Ferroviario:
                </Grid>
                <Grid item xs={6}>
                    <b>{cartaPorte?.agenciaFerroviaria?.nombre}</b>
                </Grid>
                <Grid item xs={6}>
                    Origen:
                </Grid>
                <Grid item xs={6}>
                    <b>{cartaPorte?.empresaOrigen?.nombre}</b>
                </Grid>
                <Grid item xs={6}>
                    Destino:
                </Grid>
                <Grid item xs={6}>
                    <b>{cartaPorte?.empresaDestino?.nombre}</b>
                </Grid>
                <Grid item xs={12}>
                    <Input
                        label="Cantidad de vagones a ingresar"
                        name="cantidadVagones"
                        value={waybillData?.cantidadVagones || ''}
                        onChange={(e: any) => {
                            const { value } = e?.target;
                            if (
                                (INTEGERS_UNIT.test(value) &&
                                    value?.length < 5 &&
                                    parseInt(value) <= cartaPorte?.totalVagonesPendientes) ||
                                value === ''
                            ) {
                                handleChangeWaybill(e);
                            }
                        }}
                    />
                    <span style={{ color: 'blue' }}>
                        Disponibles en la carta: {cartaPorte?.totalVagonesPendientes} vagones
                    </span>
                </Grid>
                <Grid item xs={6} mt={4}>
                    Parrilla:
                </Grid>
                <Grid item xs={6} mt={4}>
                    <b>{data?.idParrilla?.nombre}</b>
                </Grid>
                <Grid item xs={12}>
                    <Input
                        label="Vía"
                        name="nroVia"
                        onChange={(e: any) => {
                            const { value } = e?.target;
                            if ((INTEGERS_UNIT.test(value) || value === '') && value?.length < 3) {
                                handleChangeWaybill(e);
                            }
                        }}
                        value={waybillData?.nroVia || ''}
                    />
                </Grid>
                <Grid xs={12} item mt={2}>
                    <ButtonActions
                        renderBackAction
                        confirmText="Agregar"
                        disabled={
                            railwayValidation ||
                            !waybillData?.cantidadVagones ||
                            !waybillData?.nroVia
                        }
                        returnText="Cerrar"
                        onClick={() => {
                            handleChange({
                                target: {
                                    name: 'cartasPorte',
                                    value: [
                                        ...(data?.cartasPorte || []),
                                        ...[
                                            {
                                                ...waybillData,
                                                idCartaPorte: searchInput,
                                                agenciaFerroviaria:
                                                    cartaPorte?.agenciaFerroviaria?.nombre,
                                                parrilla: data?.idParrilla?.nombre,
                                                origen: cartaPorte?.empresaOrigen?.nombre,
                                                destino: cartaPorte?.empresaDestino?.nombre,
                                                id: Math.ceil(Math.random() * 10000)
                                            }
                                        ]
                                    ]
                                }
                            });
                            handleCloseDrawer();
                            clearDrawerInputs();
                        }}
                        handleClose={() => {
                            handleCloseDrawer();
                            clearDrawerInputs();
                        }}
                        flexDirection="column-reverse"
                        loading={props?.postingAnswer}
                    />
                </Grid>
            </Grid>
        </DrawerContainer>
    );
}

export default WaybillAssignmentDrawer;
