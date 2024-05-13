import { Box, Grid, Tooltip } from '@mui/material';
import { QUARTER_PERIOD_FULL } from '../../commons/States';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import ActionsMenu from './components/ActionsMenu';
import BackdropComponent from '../../components/Backdrop/BackdropComponent';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DataTable from '../../components/DataTable/DataTable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import GavelIcon from '@mui/icons-material/Gavel';
import HistoryPatentConversation from './components/HistoryPatentConversation';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PatentFilters from './components/PatentFilters';
import SearchToolbar from '../../components/SearchToolbar/SearchToolbar';
import SectionHeader from '../../components/SectionHeader';
import useGlobalFilters from '../../hooks/useGlobalFilters';
import usePatents from './hooks/usePatents';

export const getPatentConversationStateIcon = (idState: number) => {
    const iconState: { [key: number]: any } = {
        16: <InfoOutlinedIcon />,
        17: <CancelIcon sx={{ color: '#D40000' }} />,
        18: <CheckCircleIcon sx={{ color: '#118C29' }} />,
        19: <CancelIcon sx={{ color: '#D40000' }} />,
        20: <CancelIcon sx={{ color: '#D40000' }} />
    };
    return iconState[idState] || iconState[1];
};

function PatentIndex() {
    const navigate = useNavigate();

    const { isMobile, isTablet } = useIsMobile();
    const {
        filters,
        setFilters,
        debounceSearch,
        handleSubmitSearch,
        clearFilters,
        ...filterProps
    } = useGlobalFilters();
    const {
        selected,
        handleClickAction,
        handleSelectRow,
        patents,
        openCard,
        loadingPatents,
        fetchingPatents,
        handleCloseCard,
        unsubscribingPatent,
        access,
        ...props
    } = usePatents({ filters });

    return (
        <>
            <SectionHeader>
                <SectionHeader.Title>Gestión de Patentes</SectionHeader.Title>
                {!!access?.[8]?.[35] && (
                    <SectionHeader.IconHeader
                        text="Nueva Patente"
                        onClick={() => navigate('solicitud-de-patente')}
                    />
                )}
            </SectionHeader>

            <Grid
                container
                direction={isMobile ? 'column-reverse' : 'row'}
                justifyContent="center"
                alignItems="center"
                spacing={3}
                mb={2}
                sx={{
                    '& .MuiGrid-root': {
                        width: '100%'
                    }
                }}
            >
                <Grid item xs={12}>
                    <SearchToolbar
                        onChange={debounceSearch}
                        inputSearchName="nombreBuque"
                        label="Nombre de buque"
                        onClick={handleSubmitSearch}
                        clearFilters={clearFilters}
                        disabled={
                            (!!filterProps?.extraFilters?.anio &&
                                !filterProps?.extraFilters?.trimestre) ||
                            (!filterProps?.extraFilters?.anio &&
                                !!filterProps?.extraFilters?.trimestre)
                        }
                    >
                        <PatentFilters {...filterProps} />
                    </SearchToolbar>
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="flex-start"
                spacing={3}
            >
                {openCard && (isMobile || isTablet) ? (
                    ''
                ) : (
                    <Grid item xs={openCard ? 6 : 12} lg={openCard ? 8 : 12}>
                        <DataTable
                            headers={[
                                {
                                    upperLabel: (item: any) => item.buque.nombre,
                                    lowerLabel: (item: any) => item.buque.tipoBuque.nombre
                                },
                                {
                                    type: 'element',
                                    width: 3,
                                    align: 'center',
                                    template: (item: any) =>
                                        item?.judicializado && (
                                            <Tooltip title="Judicializado">
                                                <GavelIcon
                                                    sx={{
                                                        fontSize: '20px',
                                                        color: '#6837ED'
                                                    }}
                                                />
                                            </Tooltip>
                                        )
                                },
                                {
                                    type: 'element',
                                    width: 3,
                                    align: 'center',
                                    template: (item: any) =>
                                        item?.fechaBaja && (
                                            <Tooltip title="Solicitud de baja">
                                                <EventBusyIcon
                                                    sx={{
                                                        color: '#D40000'
                                                    }}
                                                />
                                            </Tooltip>
                                        )
                                },
                                {
                                    width: 45,
                                    noStyle: true,
                                    upperLabel: (item: any) => {
                                        return (
                                            <Box className="flex-align-center-gap">
                                                {getPatentConversationStateIcon(
                                                    item?.idEstadoConversacion
                                                )}
                                                <strong>
                                                    <span>{item.estadoConversacion}</span>
                                                </strong>
                                            </Box>
                                        );
                                    }
                                },
                                {
                                    titles: ['Trimestre', 'Año'],
                                    upperLabel: (item: any) => (
                                        <b>{QUARTER_PERIOD_FULL[item?.ultimoPeriodo?.trimestre]}</b>
                                    ),
                                    lowerLabel: (item: any) => <b>{item?.ultimoPeriodo?.anio}</b>,
                                    width: 15
                                },
                                {
                                    type: 'action',
                                    onClick: handleClickAction
                                }
                            ]}
                            onSelectRow={(item: any) => {
                                if (!!access?.[8]?.[37]) handleSelectRow(item);
                            }}
                            isLoading={loadingPatents}
                            items={patents || []}
                            filters={filters}
                            setFilters={setFilters}
                            isFetching={fetchingPatents}
                            selected={selected}
                        />
                    </Grid>
                )}
                {openCard && (
                    <Grid
                        item
                        xs={!isMobile && !isTablet ? 6 : 12}
                        lg={!isMobile && !isTablet ? 4 : 12}
                    >
                        <HistoryPatentConversation
                            onClose={() => handleCloseCard()}
                            selected={selected}
                            access={access}
                            {...props}
                        />
                    </Grid>
                )}
            </Grid>
            <ActionsMenu {...props} access={access} />

            <BackdropComponent loading={unsubscribingPatent} />
        </>
    );
}

export default PatentIndex;
