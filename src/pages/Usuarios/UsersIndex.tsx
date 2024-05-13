import _ from 'lodash';
import { Box, Grid, Menu, MenuItem } from '@mui/material';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BackdropComponent from '../../components/Backdrop/BackdropComponent';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DataTable from '../../components/DataTable/DataTable';
import SearchToolbar from '../../components/SearchToolbar/SearchToolbar';
import SectionHeader from '../../components/SectionHeader';
import useGlobalFilters from '../../hooks/useGlobalFilters';
import UserInformation from './components/UserInformation';
import UsersFilters from './components/UsersFilters';
import useUserAccess from '../../hooks/useUserAccess';
import useUsers from './hooks/useUsers';
import WarningIcon from '@mui/icons-material/Warning';

export interface Data {
    usuario: string;
    nombreUsuario: string;
    activo: boolean | null;
    nombreEmpresa: string;
    skip: number;
    take: number;
}

interface Combos {
    id: number;
    nombre: string;
}

const userState = (item: any) => {
    if (item?.bloqueado) {
        return (
            <>
                <WarningIcon sx={{ color: '#D40000' }} fontSize="small" />
                Bloqueado
            </>
        );
    } else if (item?.activo) {
        return (
            <>
                <CheckCircleIcon sx={{ color: '#6EBE64' }} fontSize="small" />
                Activo
            </>
        );
    } else {
        return (
            <>
                <CancelIcon sx={{ color: '#D40000' }} fontSize="small" />
                Inactivo
            </>
        );
    }
};

function UsersIndex() {
    const { id } = useParams();
    const { isMobile, isTablet } = useIsMobile();
    const { t } = useTranslation('userForm');
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
        selectedItemFromAction,
        usersData,
        openCard,
        anchorEl,
        menuOpen,
        isLoading,
        isFetching,
        changingUserState,
        parametricData,
        editUserState,
        handleClickAction,
        handleSelectRow,
        refetchUsers,
        handleCloseMenu,
        openModalConfirm,
        handleCloseCard,
        handleShowUserData,
        ...props
    } = useUsers({
        filters
    });

    return (
        <>
            <SectionHeader>
                <SectionHeader.Title>{t('mUsers.title')}</SectionHeader.Title>
                {!!access?.[6]?.[14] && (
                    <SectionHeader.IconHeader
                        text={t('mUsers.btonNewUser')}
                        onClick={() => navigate('crear-usuario')}
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
                        inputSearchName="usuario"
                        label="Usuario"
                        onClick={handleSubmitSearch}
                        clearFilters={clearFilters}
                    >
                        <UsersFilters
                            optionsSelect1={parametricData?.data?.empresas || []}
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
                                    upperLabel: 'nombre',
                                    lowerLabel: (item: any) => item.empresa.nombre
                                },
                                {
                                    type: 'data',
                                    titles: ['Usuario', 'Estado'],
                                    upperLabel: 'usuario',
                                    lowerLabel: (item: any) => (
                                        <Box display="flex" alignItems="center">
                                            {userState(item)}
                                        </Box>
                                    ),
                                    width: 20,
                                    align: 'right'
                                },
                                {
                                    type: 'action',
                                    onClick: handleClickAction
                                }
                            ]}
                            onSelectRow={(item: any) => {
                                if (!!access?.[6]?.[19]) {
                                    handleSelectRow(item);
                                }
                                if (id && item?.id !== id) {
                                    navigate('/agp/usuarios');
                                }
                            }}
                            isLoading={isLoading}
                            items={usersData}
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
                        <UserInformation
                            userData={selected}
                            onClose={handleCloseCard}
                            cambioEstado={openModalConfirm}
                            refrescarDatos={refetchUsers}
                            parametricData={parametricData}
                            loading={isLoading || isFetching}
                            {...props}
                        />
                    </Grid>
                )}
            </Grid>
            <Menu id="basic-menu" anchorEl={anchorEl} open={menuOpen} onClose={handleCloseMenu}>
                {!selectedItemFromAction?.bloqueado && (
                    <Box>
                        <MenuItem onClick={(event) => openModalConfirm(event)}>
                            {selectedItemFromAction?.activo ? 'Desactivar' : 'Activar'}
                        </MenuItem>
                    </Box>
                )}
                <MenuItem onClick={(event) => openModalConfirm(event)}>
                    {selectedItemFromAction?.bloqueado ? 'Desbloquear' : 'Bloquear'}
                </MenuItem>
                {!!access?.[6]?.[19] && !!access?.[6]?.[15] && (
                    <MenuItem onClick={handleShowUserData}>Editar Datos</MenuItem>
                )}
            </Menu>
            <BackdropComponent loading={changingUserState} />
        </>
    );
}

export default UsersIndex;
