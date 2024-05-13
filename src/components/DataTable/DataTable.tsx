import { useEffect, useState } from 'react';
import { TablePagination } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Loading from '../Loading';
import MainTable from './MainTable';

function DataTable(props: any) {
    const { t } = useTranslation('userForm');
    const { filters, setFilters, items, isLoading, noPaginated } = props;
    const [page, setPage] = useState(0);

    useEffect(() => {
        if (filters?.skip === 0) setPage(0);
    }, [filters]);

    const handleChangePage = (_: any, newPage: number) => {
        const skip = filters.skip;
        const take = filters.take;
        setFilters({
            ...filters,
            skip: newPage > page ? skip + take : skip - take
        });
        setPage(newPage);
    };

    if (isLoading) return <Loading />;

    return (
        <MainTable {...props} items={items?.data?.data}>
            {!noPaginated && (
                <TablePagination
                    labelDisplayedRows={({ from, to, count }) => {
                        return `${from}–${to} ${t('of')} ${count} items`;
                    }}
                    component="div"
                    rowsPerPageOptions={[]}
                    count={items?.data?.count || 0}
                    rowsPerPage={filters.take}
                    page={items?.data?.count <= 10 ? 0 : page}
                    onPageChange={handleChangePage}
                />
            )}
        </MainTable>
    );
}

export default DataTable;
