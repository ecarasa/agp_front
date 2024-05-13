import { getDateFilterValidation } from '../../utils/functions';
import { getDateTime } from '../../utils/common';
import { Grid, capitalize } from '@mui/material';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { useAppSelector } from '../../hooks/reduxHooks';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import ActionsMenu from './components/ActionsMenu';
import BackdropComponent from '../../components/Backdrop/BackdropComponent';
import CartaPorteInfoCard from './components/CartaPorteInfoCard';
import CartasPorteFilters from './components/CartasPorteFilters';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DataTable from '../../components/DataTable/DataTable';
import InfoIcon from '@mui/icons-material/Info';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import SearchToolbar from '../../components/SearchToolbar/SearchToolbar';
import SectionHeader from '../../components/SectionHeader';
import useCartaPorte from './hooks/useCartaPorte';
import useGlobalFilters from '../../hooks/useGlobalFilters';
import useUserAccess from '../../hooks/useUserAccess';

export const getStateIcon = (idState: string) => {
    const iconState: { [key: string]: any } = {
        Pendiente: <InfoIcon sx={{ color: '#3761ED' }} />,
        Impresa: <LocalPrintshopIcon />,
        Modificada: <InfoIcon />,
        'Inspeccionada Total': <CheckCircleIcon sx={{ color: '#118C29' }} />,
        'Inspeccionada Parcial': <CheckCircleIcon sx={{ color: '#808080' }} />,
        'Ingresada Parcial': <CheckCircleIcon sx={{ color: '#808080' }} />,
        'Ingresada Total': <CheckCircleIcon sx={{ color: '#118C29' }} />,
        'Egresada Parcial': <CheckCircleIcon sx={{ color: '#808080' }} />,
        'Egresada Total': <CheckCircleIcon sx={{ color: '#118C29' }} />,
        'En Terminal': <CheckCircleIcon sx={{ color: '#118C29' }} />
    };
    return iconState[idState] || iconState['Pendiente'];
};

function CartasPorteIndex() {
    const access = useUserAccess();
    const navigate = useNavigate();
    const user = useAppSelector(selectCurrentUser);
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
        openCard,
        selected,
        cartasPorte,
        loadingCartasPorte,
        fetchingCartasPorte,
        downloadingWaybillFile,
        handleClickAction,
        handleSelectRow,
        ...props
    } = useCartaPorte({ filters });

    return (
        <>
            <SectionHeader>
                <SectionHeader.Title>Gestión de Cartas de Porte</SectionHeader.Title>
                {!!access?.[4]?.[67] && (
                    <SectionHeader.IconHeader
                        onClick={() => navigate('alta-carta-porte')}
                        text="Nueva Carta de Porte"
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
                        inputSearchName="numero"
                        label="Número Carta de Porte"
                        onClick={handleSubmitSearch}
                        clearFilters={clearFilters}
                        disabled={getDateFilterValidation(filterProps)}
                    >
                        <CartasPorteFilters {...filterProps} />
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
                                    titles: ['Carta de Porte', 'Agente Ferroviario'],
                                    upperLabel: (item: any) => <b>{item.id}</b>,
                                    lowerLabel: (item: any) => (
                                        <b>{item.agenciaFerroviaria.nombre}</b>
                                    )
                                },
                                {
                                    type: 'element',
                                    width: 3,
                                    align: 'center',
                                    template: (item: any) => getStateIcon(item.estado)
                                },
                                {
                                    width: 40,
                                    noStyle: true,
                                    upperLabel: (item: any) => {
                                        return (
                                            <div className="flex-align-center">
                                                {capitalize(item.estado)}
                                            </div>
                                        );
                                    },
                                    lowerLabel: (item: any) => getDateTime(item.fecha)
                                },
                                {
                                    titles: ['Origen', 'Destino'],
                                    upperLabel: (item: any) => <b>{item.empresaOrigen.nombre}</b>,
                                    lowerLabel: (item: any) => <b>{item?.empresaDestino.nombre}</b>,
                                    width: 15
                                },
                                {
                                    type: 'action',
                                    onClick: handleClickAction
                                }
                            ]}
                            onSelectRow={(item: any) => {
                                if (!!access?.[4]?.[66]) handleSelectRow(item);
                            }}
                            isLoading={loadingCartasPorte}
                            items={cartasPorte || []}
                            filters={filters}
                            setFilters={setFilters}
                            isFetching={fetchingCartasPorte}
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
                        <CartaPorteInfoCard {...props} />
                    </Grid>
                )}
                <ActionsMenu {...props} access={access} user={user} />
                <BackdropComponent loading={downloadingWaybillFile} />
            </Grid>
        </>
    );
}

export default CartasPorteIndex;
