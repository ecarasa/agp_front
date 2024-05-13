import { Box, Grid } from '@mui/material';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { useEffect, useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DataTable from '../../components/DataTable/DataTable';
import RolesFilters from './components/RolesFilters';
import SearchToolbar from '../../components/SearchToolbar/SearchToolbar';
import SectionHeader from '../../components/SectionHeader';
import useGlobalFilters from '../../hooks/useGlobalFilters';
import useUserAccess from '../../hooks/useUserAccess';

import { useGetRolesQuery } from '../../services/rolesApi';
import { useGetParametricDataQuery } from '../../services/companyApi';

export interface IRoles {
    count: number;
    totalCount: number;
    skip: number;
    take: number;
    data: Roles[];
}

export interface Roles {
    id: number;
    nombre: string;
}

function AdminRoles() {
    const { t } = useTranslation('roles');
    const access = useUserAccess();
    const navigate = useNavigate();
    const { isMobile } = useIsMobile();

    const [selected, setSelected] = useState<any>(null);
    const [page, setPage] = useState(0);

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
        data: rolesData,
        isLoading,
        isFetching
    } = useGetRolesQuery(filters, { refetchOnMountOrArgChange: true });

    const { data: parametricData } = useGetParametricDataQuery();

    const handleClickCard = (item: Roles) => {
        navigate(`${item.id}`);
    };

    useEffect(() => {
        if (filters.skip === 0) setPage(0);
    }, [filters]);

    return (
        <>
            <SectionHeader>
                <SectionHeader.Title>{t('title')}</SectionHeader.Title>
                {!!access?.[7]?.[41] && (
                    <SectionHeader.IconHeader
                        text={t('new-rol')}
                        onClick={() => navigate('crear')}
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
                        label="Rol"
                        hideFilterButton={true}
                        onClick={handleSubmitSearch}
                        clearFilters={clearFilters}
                    >
                        <></>
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
                <Grid item xs={12}>
                    <DataTable
                        headers={[
                            {
                                type: 'data',
                                upperLabel: (item: Roles) => item.nombre
                            }
                        ]}
                        onSelectRow={(item: Roles) => {
                            if (!!access?.[7]?.[42]) handleClickCard(item);
                        }}
                        isLoading={isLoading}
                        items={rolesData}
                        filters={filters}
                        setFilters={setFilters}
                        isFetching={isFetching}
                        selected={selected}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default AdminRoles;
