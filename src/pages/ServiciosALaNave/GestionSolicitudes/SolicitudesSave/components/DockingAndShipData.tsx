import { getDateTime } from '../../../../../utils/common';
import { Grid } from '@mui/material';
import AutocompleteComponent from '../../../../../components/layout/Autocomplete';
import Input from '../../../../../components/Input/Input';

function DockingAndShipData(props: any) {
    const { data, ships, loadingShips, fetchingShips, handleChange, debounceSearch } = props;

    return (
        <>
            <Grid item xs={12} md={6}>
                <AutocompleteComponent
                    value={data?.idBuque || ''}
                    onInputChange={(data: any) => {
                        if (
                            !ships?.find((i: any) =>
                                data?.toLowerCase().includes(i?.nombre?.toLowerCase())
                            )
                        )
                            debounceSearch({ target: { name: 'nombre', value: data } });
                    }}
                    onChange={(value: any) => {
                        handleChange({ target: { name: 'idBuque', value: value } });
                    }}
                    label="Nombre del Buque"
                    name="idBuque"
                    options={ships || []}
                    loading={loadingShips || fetchingShips}
                    type="search"
                    hiddeArrow
                    required
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <AutocompleteComponent
                    value={data?.idGiro || ''}
                    onChange={(value: any) =>
                        handleChange({
                            target: {
                                name: 'idGiro',
                                value: value
                            }
                        })
                    }
                    templateLabel={(option: any) =>
                        `${getDateTime(option?.fechaIngresoRada)} - ID ${option?.id} - ${
                            option?.agencia?.nombre
                        }`
                    }
                    label="Giro"
                    name="idGiro"
                    options={data?.idBuque?.giros || []}
                    loading={false}
                    required
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <AutocompleteComponent
                    value={data?.idMuelle || null}
                    onChange={(value: any) =>
                        handleChange({
                            target: {
                                name: 'idMuelle',
                                value: value
                            }
                        })
                    }
                    label="Muelle"
                    name="idMuelle"
                    options={
                        data?.idGiro?.movimientos?.map((i: any) => ({
                            ...i?.muelle,
                            idMovimiento: i?.id,
                            terminal: i?.terminal
                        })) || []
                    }
                    loading={false}
                    required
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Input
                    name="terminal"
                    value={data?.idMuelle?.terminal?.nombre || ''}
                    label="Terminal"
                    readOnly
                />
            </Grid>
        </>
    );
}

export default DockingAndShipData;
