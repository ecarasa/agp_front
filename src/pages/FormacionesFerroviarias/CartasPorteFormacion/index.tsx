import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/DataTable/DataTable';
import SectionHeader from '../../../components/SectionHeader';
import useCartasPorteFormacion from './hooks/useCartasPorteFormacion';
import useGlobalFilters from '../../../hooks/useGlobalFilters';

interface ItemProps {
    id: string;
    initialId: string;
    numero: number;
    nroVia: number;
    totalVagones: number;
    cantidadVagonesEnFormacion: number;
    agenciaFerroviaria: CompanyProps;
    empresaOrigen: CompanyProps;
    empresaDestino: CompanyProps;
}

type CompanyProps = {
    id: number;
    nombre: string;
};

function CartasPorteFormacion() {
    const navigate = useNavigate();
    const { filters, setFilters } = useGlobalFilters();
    const { data, isLoading, isFetching } = useCartasPorteFormacion({ filters });

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>Cartas de Porte de Formación</SectionHeader.Title>
            </SectionHeader>

            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="flex-start"
                spacing={3}
                mt={5}
            >
                <Grid item xs={12}>
                    <DataTable
                        headers={[
                            {
                                titles: ['Carta de Porte', 'Agente Ferroviario'],
                                upperLabel: (item: ItemProps) => <b>{item?.initialId}</b>,
                                lowerLabel: (item: ItemProps) => (
                                    <b>{item?.agenciaFerroviaria?.nombre}</b>
                                )
                            },
                            {
                                titles: ['Vagones', 'Vía'],
                                upperLabel: (item: ItemProps) => (
                                    <b>
                                        {item?.cantidadVagonesEnFormacion +
                                            '/' +
                                            item?.totalVagones}
                                    </b>
                                ),
                                lowerLabel: (item: ItemProps) => <b>{item?.nroVia}</b>
                            },
                            {
                                titles: ['Origen', 'Destino'],
                                upperLabel: (item: ItemProps) => (
                                    <b>{item?.empresaOrigen?.nombre}</b>
                                ),
                                lowerLabel: (item: ItemProps) => (
                                    <b>{item?.empresaDestino?.nombre}</b>
                                ),
                                width: 15
                            }
                        ]}
                        onSelectRow={(item: ItemProps) =>
                            navigate(`/agp/cartas-de-porte/${item?.initialId}/detalle`)
                        }
                        filters={filters}
                        setFilters={setFilters}
                        isLoading={isLoading}
                        items={data || []}
                        isFetching={isFetching}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default CartasPorteFormacion;
