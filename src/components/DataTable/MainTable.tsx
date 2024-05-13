import { Box, Paper, Table, TableBody, TableContainer, TableHead } from '@mui/material';
import { useAppSelector } from '../../hooks/reduxHooks';
import DataTableRow from './DataTableRow';
import Loading from '../Loading';
import NoInfo from '../NoInfo';
import styles from './styles.module.css';

const MainTable = (props: any) => {
    const { items, children, isFetching, style, headers } = props;
    const { loading } = useAppSelector((state) => state.application);

    return (
        <Box sx={style || null}>
            <Paper sx={{ borderRadius: '10px 10px 0px 0px' }}>
                <TableContainer sx={{ borderRadius: '10px 10px 0 0' }}>
                    <Table
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        className={styles['datatable']}
                    >
                        <TableHead>
                            <tr style={{ height: '28px' }}>
                                {!!headers.length ? (
                                    headers.map((header: any, index: number) => {
                                        const width = header?.width || null;
                                        return header ? (
                                            <th
                                                key={index}
                                                style={{
                                                    backgroundColor: 'var(--primary)',
                                                    width:
                                                        header?.type === 'action'
                                                            ? '5%'
                                                            : `${width}%` || 'auto'
                                                }}
                                            />
                                        ) : null;
                                    })
                                ) : (
                                    <th
                                        style={{
                                            backgroundColor: 'var(--primary)'
                                        }}
                                    />
                                )}
                            </tr>
                        </TableHead>
                        <TableBody className={styles['datatable-tbody']}>
                            {isFetching || loading ? (
                                <tr>
                                    <td colSpan={headers?.length}>
                                        <Loading size="small" />
                                    </td>
                                </tr>
                            ) : (
                                items?.map((item: any, index: number) => (
                                    <DataTableRow
                                        key={item?.id || index}
                                        item={item}
                                        headers={headers}
                                        {...props}
                                    />
                                ))
                            )}
                        </TableBody>
                    </Table>
                    {items === undefined && !loading && !isFetching && <NoInfo />}
                    {items?.length < 1 && !loading && !isFetching && <NoInfo text="noItems" />}
                </TableContainer>
            </Paper>
            <div>{children}</div>
        </Box>
    );
};

export default MainTable;
