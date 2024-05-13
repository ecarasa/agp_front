import { Box, Card, CardContent, Grid, TextareaAutosize } from '@mui/material';
import Button from '../../../../../components/button/Button';
import CloseButton from '../../../../../components/CloseButton';
import StateService from './StateService';
import styles from '../styles.module.css';

const tipoDato: { [key: string]: string } = {
    C: 'Texto',
    N: 'Número'
};

function AttributeDetailCard(props: any) {
    const { selected, handleActivateAttribute, handleCloseCard, id } = props;

    return (
        <Box>
            <Card className="card-container" variant="outlined" sx={{ height: 'inherit' }}>
                <CardContent>
                    <CloseButton position="right" onClose={handleCloseCard} />
                    <p className="info-card-title">{selected?.nombre}</p>
                    <Grid container spacing={3} p={4}>
                        <Grid item xs={6}>
                            Estado:
                        </Grid>
                        <Grid item xs={6}>
                            <StateService data={selected} />
                        </Grid>
                        <Grid item xs={6}>
                            Obligatoriedad:
                        </Grid>
                        <Grid item xs={6}>
                            <b>{selected?.obligatorio ? 'Obligatorio' : 'No obligatorio'}</b>
                        </Grid>
                        <Grid item xs={6}>
                            Tipo de dato:
                        </Grid>
                        <Grid item xs={6}>
                            <b>{tipoDato[selected?.tipo] || ''}</b>
                        </Grid>

                        <Grid item xs={12} mt={2}>
                            <TextareaAutosize
                                minRows={3}
                                maxRows={8}
                                name="nota"
                                readOnly
                                placeholder="Nota"
                                value={selected?.nota || ''}
                                style={{
                                    color: 'black',
                                    padding: '10px',
                                    fontSize: '16px'
                                }}
                            />
                        </Grid>
                        {id && (
                            <Grid item xs={12} className="flex-center" mt={2}>
                                <Button type="outlined" onClick={handleActivateAttribute} strong>
                                    {selected?.activo ? 'DESACTIVAR' : 'ACTIVAR'}
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}

export default AttributeDetailCard;
