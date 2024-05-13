import { memo } from 'react';
import { TableRow } from '@mui/material';
import DataTableCell from './DataTableCell';
import styles from './styles.module.css';

function DataTableRow(props: any) {
    const { item, headers, onSelectRow, selected } = props;

    return (
        <TableRow className={styles['datatable-rows']} selected={item?.id === selected?.id}>
            {headers.map((header: any, subIndex: number) => {
                return header ? (
                    <td
                        key={subIndex}
                        className={styles['datatable-tr-td-overflow']}
                        align={header?.type === 'action' ? 'center' : header?.align || 'left'}
                        onClick={(e) =>
                            ['action', 'selection'].includes(header?.type)
                                ? header.onClick(e, item)
                                : onSelectRow(item)
                        }
                    >
                        <DataTableCell
                            onSelectRow={onSelectRow}
                            header={header}
                            item={item}
                            {...props}
                        />
                    </td>
                ) : null;
            })}
        </TableRow>
    );
}

export default memo(DataTableRow);
