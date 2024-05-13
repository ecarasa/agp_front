import { Box, Grid, Menu, MenuItem } from '@mui/material';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BackdropComponent from '../../components/Backdrop/BackdropComponent';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DataTable from '../../components/DataTable/DataTable';
import EmpresaInformation from './components/EmpresaInformation';
import EmpresasFilters from './components/EmpresasFilters';
import SearchToolbar from '../../components/SearchToolbar/SearchToolbar';
import SectionHeader from '../../components/SectionHeader';
import useEmpresas from './hooks/useEmpresas';
import useGlobalFilters from '../../hooks/useGlobalFilters';
import useUserAccess from '../../hooks/useUserAccess';
import WarningIcon from '@mui/icons-material/Warning';

export interface Data {
    usuario: string;
    nombreUsuario: string;
    activo: boolean | null;
    nombreEmpresa: string;
    skip: number;
    take: number;
}

const companyState = (item: any) => {
    if (item?.bloqueado) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'inherit' }}>
                <WarningIcon sx={{ color: '#D40000' }} fontSize="small" />
                <Box>Bloqueada</Box>
            </Box>
        );
    } else if (item?.activo) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'inherit', alignItems: 'center' }}>
                <CheckCircleIcon sx={{ color: '#6EBE64' }} fontSize="small" />
                <Box>Activa</Box>
            </Box>
        );
    } else {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'inherit' }}>
                <CancelIcon sx={{ color: '#D40000' }} fontSize="small" />
                <Box>Inactiva</Box>
            </Box>
        );
    }
};

function EmpresasIndex() {
    const { t } = useTranslation('userForm');
    const { isMobile, isTablet } = useIsMobile();
    const access = useUserAccess();
    const navigate = useNavigate();

    const {
        filters,
        setFilters,
        extraFilters,
        handleSubmitSearch,
        handleChangeExtraFilters,
        debounceSearch,
        setExtraFilters,
        clearFilters
    } = useGlobalFilters();

    const {
        selected,
        parametricData,
        anchorEl,
        menuOpen,
        openCard,
        companyData,
        isLoading,
        edittingCompanyState,
        isFetching,
        selectedItemFromAction,
        handleOpenCard,
        handleCloseCard,
        handleCloseMenu,
        openModalConfirm,
        handleClickAction,
        ...props
    } = useEmpresas({ filters });

    return (
        <>
            <SectionHeader>
                <SectionHeader.Title>{t('mEmpresas.title')}</SectionHeader.Title>
                {!!access?.[7]?.[41] && (
                    <SectionHeader.IconHeader
                        text={t('mEmpresas.btonNewEmpresa')}
                        onClick={() => navigate('crear-empresa')}
                    />
                )}
            </SectionHeader>

            <Grid
                container
                direction={isMobile ? 'column-reverse' : 'row'}
                justifyContent="center"
                alignItems="center"
                spacing={3}
                sx={{
                    '& .MuiGrid-root': {
                        width: '100%'
                    }
                }}
            >
                <Grid item xs={12} sx={{ margin: '0 0 15px 0' }}>
                    <SearchToolbar
                        onChange={debounceSearch}
                        inputSearchName="nombre"
                        label="Nombre de empresa"
                        onClick={handleSubmitSearch}
                        clearFilters={clearFilters}
                    >
                        <EmpresasFilters
                            parametricData={parametricData}
                            extraFilters={extraFilters}
                            setExtraFilters={setExtraFilters}
                            handleChangeExtraFilters={handleChangeExtraFilters}
                        />
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
                                    type: 'data',
                                    upperLabel: (item: any) => item.nombre,
                                    lowerLabel: (item: any) => item.nombreComercial
                                },
                                {
                                    type: 'data',
                                    titles: ['Pais', 'Estado'],
                                    upperLabel: (item: any) => item?.pais?.nombre,
                                    lowerLabel: (item: any) => companyState(item),
                                    width: 20,
                                    align: 'right'
                                },
                                {
                                    type: 'action',
                                    onClick: handleClickAction
                                }
                            ]}
                            onSelectRow={(item: any) => {
                                if (!!access?.[7]?.[42]) handleOpenCard(item);
                            }}
                            isLoading={isLoading}
                            items={companyData}
                            filters={filters}
                            setFilters={setFilters}
                            isFetching={isFetching}
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
                        <EmpresaInformation
                            onClose={handleCloseCard}
                            cambioEstado={openModalConfirm}
                            parametricData={parametricData}
                            access={access}
                            {...props}
                        />
                    </Grid>
                )}
            </Grid>
            <Menu id="basic-menu" anchorEl={anchorEl} open={menuOpen} onClose={handleCloseMenu}>
                <Box>
                    <MenuItem onClick={(event) => openModalConfirm(event)}>
                        {selectedItemFromAction?.activo ? 'Desactivar' : 'Activar'}
                    </MenuItem>
                </Box>
                {!!access?.[7]?.[42] && (
                    <MenuItem
                        onClick={() => {
                            handleOpenCard(selectedItemFromAction);
                            handleCloseMenu();
                        }}
                    >
                        Editar Datos
                    </MenuItem>
                )}
            </Menu>
            <BackdropComponent loading={edittingCompanyState} />
        </>
    );
}

export default EmpresasIndex;
