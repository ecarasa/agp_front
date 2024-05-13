import { Box, Grid } from '@mui/material';
import { INTEGERS_UNIT } from '../../../../constants/regex';
import BackdropComponent from '../../../../components/Backdrop/BackdropComponent';
import Button from '../../../../components/button/Button';
import DataTable from '../../../../components/DataTable/DataTable';
import DeleteIcon from '@mui/icons-material/Delete';
import Input from '../../../../components/Input/Input';
import SectionFormAccordion from '../../../../components/SectionFormAccordion/SectionFormAccordion';
import style from '../../styles.module.css';

function StepTwo(props: any) {
    const {
        handleSearch,
        loadingWaybill,
        fetchingWaybill,
        data,
        handleChange,
        searchInput,
        setSearchInput,
        cartaPorte
    } = props;

    return (
        <>
            <SectionFormAccordion title="Asignación de Carta de Porte">
                <Grid item xs={12}>
                    <Grid container spacing={2} display={'flex'} alignItems={'center'}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Input
                                onChange={(e: any) => {
                                    const { value } = e?.target;
                                    if (
                                        (INTEGERS_UNIT.test(value) || value === '') &&
                                        value?.length < 9
                                    ) {
                                        setSearchInput(value);
                                    }
                                }}
                                value={searchInput || ''}
                                type="search"
                                name="searchInput"
                                label="Carta de Porte"
                                size="small"
                                onKeyDown={handleSearch}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Button disabled={!searchInput} onClick={handleSearch}>
                                Buscar
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <span className={style['subtitles']}>
                        Formación {data?.nroLocomotora} - {data?.idParrilla?.nombre}
                    </span>
                </Grid>
                <Grid item xs={12}>
                    <span className={style['subtitles']}>Asignadas</span>
                    <DataTable
                        headers={[
                            {
                                titles: ['Carta de Porte', 'Agente Ferroviario'],
                                upperLabel: (item: any) => <b>{item?.idCartaPorte}</b>,
                                lowerLabel: (item: any) => <b>{item?.agenciaFerroviaria}</b>
                            },
                            {
                                titles: ['Vagones', 'Vía'],
                                upperLabel: (item: any) => (
                                    <b>
                                        {item?.cantidadVagones +
                                            '/' +
                                            cartaPorte?.totalVagonesPendientes}
                                    </b>
                                ),
                                lowerLabel: (item: any) => <b>{item?.nroVia}</b>
                            },
                            {
                                titles: ['Origen', 'Destino'],
                                upperLabel: (item: any) => <b>{item?.origen}</b>,
                                lowerLabel: (item: any) => <b>{item?.destino}</b>,
                                width: 15
                            },
                            {
                                type: 'action',
                                icon: <DeleteIcon />,
                                onClick: (e: any, item: any) => {
                                    handleChange({
                                        target: {
                                            name: 'cartasPorte',
                                            value: data?.cartasPorte?.filter(
                                                (carta: any) => carta.id !== item.id
                                            )
                                        }
                                    });
                                }
                            }
                        ]}
                        onSelectRow={() => null}
                        noPaginated
                        isLoading={false}
                        items={{ data: { data: data?.cartasPorte } }}
                        isFetching={false}
                    />
                </Grid>
            </SectionFormAccordion>

            <BackdropComponent loading={loadingWaybill} fetching={fetchingWaybill} />
        </>
    );
}

export default StepTwo;
