import _ from 'lodash';
import { Grid } from '@mui/material';
import { INTEGERS_OR_THREE_DECIMALS, INTEGERS_UNIT } from '../../../../constants/regex';
import { SHIP_STATES } from '../../../../commons/States';
import AutocompleteComponent from '../../../../components/layout/Autocomplete';
import Button from '../../../../components/button/Button';
import Input from '../../../../components/Input/Input';
import SectionFormAccordion from '../../../../components/SectionFormAccordion/SectionFormAccordion';
import ShipInfoDialog from './ShipInfoDialog';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningAlert from '../../../../components/WarningAlert';

function ShipDetail(props: any) {
    const {
        data,
        debounceSearch,
        handleChange,
        ships,
        fetchingShips,
        shipInfoDialog,
        setShipInfoDialog,
        showShipFullData,
        fetchingShipByid,
        stepValidation,
        handleValidationSteps,
        errors
    } = props;

    return (
        <>
            <SectionFormAccordion title="Identificación del buque">
                {data?.buque && data?.buque?.estado === 'SB' && (
                    <Grid item xs={12}>
                        <WarningAlert>
                            {`El buque se encuentra en estado ${SHIP_STATES[data?.buque?.estado]}`}
                        </WarningAlert>
                    </Grid>
                )}
                <Grid item xs={12} sm={6}>
                    <AutocompleteComponent
                        value={data?.buque || ''}
                        onInputChange={(data: any) => {
                            if (
                                !ships?.find((i: any) =>
                                    data?.toLowerCase().includes(i?.nombre?.toLowerCase())
                                )
                            )
                                debounceSearch({ target: { name: 'nombreBarco', value: data } });
                        }}
                        onChange={(value: any) => {
                            if (stepValidation?.firstStepValidated) handleValidationSteps();
                            handleChange({ target: { name: 'buque', value: value } });
                        }}
                        templateLabel={(option: any) =>
                            `${option.nombre} - (${
                                option?.imo
                                    ? `IMO: ${option.imo}`
                                    : `M/B: ${option.matricula}/${option.pais.nombre}`
                            })`
                        }
                        label="Nombre del Buque"
                        name="nombre_buque"
                        options={ships || []}
                        loading={fetchingShips}
                        type="search"
                        hiddeArrow
                        required
                        warning={data?.buque && data?.buque?.estado === 'SB'}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        readOnly
                        value={data?.buque?.senalDistintiva || ''}
                        name="senalDistintiva"
                        label="Señal Distintiva"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AutocompleteComponent
                        value={data?.buque?.tipoBuque}
                        label="Tipo de Embarcación"
                        options={[{ ...data?.buque?.tipoBuque }] || []}
                        name="idTipoEmbarcacion"
                        readOnly
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AutocompleteComponent
                        value={data?.buque?.pais}
                        readOnly
                        label="Bandera"
                        name="idPais"
                        templateLabel={(option: any) => option.nombre}
                        options={[{ ...data?.buque?.pais }] || []}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input value={data?.buque?.imo || ''} readOnly label="Número de IMO" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input value={data?.buque?.matricula || ''} label="Matrícula" readOnly />
                </Grid>
            </SectionFormAccordion>
            <SectionFormAccordion title="Información de Calado">
                <Grid item xs={12} sm={6}>
                    <Input
                        label="Calado de entrada"
                        value={data?.caladoEntrada || ''}
                        name="caladoEntrada"
                        onChange={(e: any) => {
                            let value = e.target.value;
                            if (
                                (value?.length < 10 && INTEGERS_OR_THREE_DECIMALS.test(value)) ||
                                (value === '' && !isNaN(Number(value)))
                            ) {
                                if (stepValidation?.firstStepValidated) handleValidationSteps();
                                handleChange({
                                    target: { name: 'caladoEntrada', value: value }
                                });
                            }
                        }}
                        errors={errors}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        label="Calado de salida"
                        value={data?.caladoSalida || ''}
                        name="caladoSalida"
                        onChange={(e: any) => {
                            let value = e.target.value;
                            if (
                                (value?.length < 10 && INTEGERS_OR_THREE_DECIMALS.test(value)) ||
                                (value === '' && !isNaN(Number(value)))
                            ) {
                                if (stepValidation?.firstStepValidated) handleValidationSteps();
                                handleChange({
                                    target: {
                                        name: 'caladoSalida',
                                        value: value
                                    }
                                });
                            }
                        }}
                        errors={errors}
                        required
                    />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <VisibilityIcon />
                    <Button
                        loading={fetchingShipByid}
                        type="text"
                        onClick={showShipFullData}
                        disabled={!data?.buque?.id}
                    >
                        Información del Buque
                    </Button>
                </Grid>
            </SectionFormAccordion>
            <SectionFormAccordion title="Tripulación">
                <Grid item xs={12} sm={6}>
                    <Input
                        label="Nombre de Capitán"
                        name="capitan"
                        value={data?.capitan || ''}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        label="Cantidad de Pasajeros"
                        value={data?.pasajeros || ''}
                        name="pasajeros"
                        onChange={(e: any) => {
                            let value = e.target.value;
                            if ((INTEGERS_UNIT.test(value) || value === '') && value?.length < 6) {
                                if (stepValidation?.firstStepValidated) handleValidationSteps();
                                handleChange({
                                    target: { name: 'pasajeros', value: Number(value) }
                                });
                            }
                        }}
                        errors={errors}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        label="Cantidad de Tripulantes"
                        value={data?.tripulacion || ''}
                        name="tripulacion"
                        onChange={(e: any) => {
                            let value = e.target.value;
                            if ((INTEGERS_UNIT.test(value) || value === '') && value?.length < 6) {
                                handleChange({
                                    target: {
                                        name: 'tripulacion',
                                        value: Number(value)
                                    }
                                });
                            }
                        }}
                        required
                    />
                </Grid>
            </SectionFormAccordion>
            <ShipInfoDialog open={shipInfoDialog} setOpen={setShipInfoDialog} />
        </>
    );
}

export default ShipDetail;
