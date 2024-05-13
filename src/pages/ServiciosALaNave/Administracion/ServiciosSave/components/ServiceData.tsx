import { Grid } from '@mui/material';
import AutocompleteComponent from '../../../../../components/layout/Autocomplete';
import AutocompleteConChips from '../../../../../components/layout/SelectConChips';
import Input from '../../../../../components/Input/Input';
import StateService from './StateService';
import styles from '../styles.module.css';
import SwitchComponent from './SwitchComponent';

function ServiceData(props: any) {
    const { id, data, handleChange, ...restProps } = props;

    return (
        <>
            <Grid item xs={12} md={6}>
                <Input
                    name="nombre"
                    value={data?.nombre || ''}
                    label="Nombre del Servicio"
                    onChange={handleChange}
                    required
                    disabled={!!id}
                />
            </Grid>
            <Grid item xs={12} md={6} className={styles['state-service-box']}>
                <span className={styles['state-service-title']}>Estado del Servicio:</span>
                <SwitchComponent data={data} handleChange={handleChange} />
                <StateService data={data} />
            </Grid>
            <Grid item xs={12} md={6}>
                <AutocompleteConChips
                    value={data?.idsPrestadores || []}
                    setValue={(value: any) =>
                        handleChange({
                            target: {
                                name: 'idsPrestadores',
                                value: value
                            }
                        })
                    }
                    width="100%"
                    label="Empresa Prestadora de Servicio"
                    name="idsPrestadores"
                    options={restProps?.prestadores || []}
                    loading={restProps?.loadingPrestadores || restProps?.fetchingPrestadores}
                    required
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <AutocompleteComponent
                    value={data?.idGerencia}
                    onChange={(value: any) =>
                        handleChange({
                            target: {
                                name: 'idGerencia',
                                value: value
                            }
                        })
                    }
                    label="Gerencia"
                    name="idGerencia"
                    disabled={!!id}
                    options={restProps?.gerencias || []}
                    loading={restProps?.loadingManagements || restProps?.fetchingManagements}
                    required
                />
            </Grid>
        </>
    );
}

export default ServiceData;
