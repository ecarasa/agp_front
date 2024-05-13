import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    Radio,
    RadioGroup
} from '@mui/material';
import Button from '../../../../../components/button/Button';
import Input from '../../../../../components/Input/Input';

function ServiceAttributes(props: any) {
    const { attributes, handleChange, clearAttributeInputs, handleAddAttribute } = props;

    return (
        <>
            <Grid item xs={12} sm={6}>
                <Input
                    label="Atributo"
                    name="nombre"
                    onChange={(event: any) => handleChange(event, 'attributes')}
                    value={attributes?.nombre}
                />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'inline-flex' }}>
                <FormGroup sx={{ flexDirection: 'row' }}>
                    {/* <FormControlLabel control={<Checkbox />} label="Requiere Adjunto" name="requiereAdjunto"/> */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={attributes?.obligatorio}
                                onChange={(event: any) => handleChange(event, 'attributes')}
                            />
                        }
                        label="Obligatorio"
                        name="obligatorio"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={attributes?.activo}
                                onChange={(event: any) => handleChange(event, 'attributes')}
                            />
                        }
                        label="Activo"
                        name="activo"
                    />
                </FormGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <RadioGroup
                        sx={{
                            flexDirection: 'row',
                            justifyContent: { xs: 'flex-start', sm: 'space-evenly' },
                            width: '100%'
                        }}
                        aria-labelledby="controlled-radio-buttons-group"
                        name="tipo"
                        value={attributes?.tipo}
                        onChange={(event: any) => handleChange(event, 'attributes')}
                    >
                        <FormControlLabel value="C" control={<Radio />} label="Texto" />
                        <FormControlLabel value="N" control={<Radio />} label="Número" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <br />
            <Grid item xs={12}>
                <Input
                    label="Nota"
                    name="nota"
                    onChange={(event: any) => handleChange(event, 'attributes')}
                    value={attributes?.nota}
                />
            </Grid>
            <Grid item xs={12} className="flex-center" mt={4}>
                <Button
                    onClick={() => {
                        handleAddAttribute();
                        clearAttributeInputs();
                    }}
                    type="outlined"
                    disabled={!attributes?.nombre || !attributes?.tipo}
                >
                    Agregar
                </Button>
            </Grid>
        </>
    );
}

export default ServiceAttributes;
