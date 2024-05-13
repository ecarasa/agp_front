import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ReactElement } from 'react';
import styles from './styles.module.css';

type HeaderProps = {
    showTitle?: boolean;
    upperLabel?: string | any;
    lowerLabel?: string | any;
    titles?: any[];
    type: string;
    icon?: any;
    onClick?: any;
    template: (v: any, i?: any) => ReactElement;
    width?: string;
    align?: 'right' | 'left' | 'center' | 'justify' | 'char' | undefined;
    noStyle?: boolean;
};

interface Props {
    header: HeaderProps;
    item: any;
    index: number;
    onSelectRow: any;
}

function DataTableCell({ header, item, index }: Props) {
    const DataCell = () => {
        if (header?.titles) {
            return (
                <table>
                    <tbody
                        className={header?.align ? styles[`table-tbody-align-${header.align}`] : ''}
                    >
                        <tr>
                            {header?.titles[0] && <td>{header?.titles[0]}:</td>}
                            <td colSpan={!!header?.titles[0] ? 1 : 2}>
                                {typeof header?.upperLabel === 'function'
                                    ? header?.upperLabel(item)
                                    : item[header?.upperLabel]}
                            </td>
                        </tr>
                        <tr>
                            {header?.titles[1] && <td>{header?.titles[1]}:</td>}
                            <td colSpan={!!header?.titles[1] ? 1 : 2}>
                                {typeof header?.lowerLabel === 'function'
                                    ? header?.lowerLabel(item)
                                    : item[header?.lowerLabel]}
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        } else {
            return (
                <table className={styles[header?.noStyle ? '' : 'datatable-subtable']}>
                    <tbody>
                        <tr>
                            <td align={header?.align || 'left'}>
                                {typeof header?.upperLabel === 'function'
                                    ? header?.upperLabel(item)
                                    : item[header?.upperLabel]}
                            </td>
                        </tr>
                        <tr>
                            <td align={header?.align || 'left'}>
                                {typeof header?.lowerLabel === 'function'
                                    ? header?.lowerLabel(item)
                                    : item[header?.lowerLabel]}
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        }
    };

    const ActionCell = () => {
        return (
            <IconButton className={styles['iconbtn-m']} aria-label="menuOpciones">
                {header?.icon ? header.icon : <MoreVertIcon />}
            </IconButton>
        );
    };

    const ElementCell = () => {
        if (!header.template) return <></>;
        return <>{header.template(item, index)}</>;
    };

    const SelectionCell = () => {
        return (
            <IconButton className={styles['iconbtn-m']} aria-label="selectionCell">
                {header.template(item, index)}
            </IconButton>
        );
    };

    function RenderTd() {
        switch (header?.type) {
            case 'selection':
                return <SelectionCell />;
            case 'action':
                return <ActionCell />;
            case 'element':
                return <ElementCell />;
            default:
                return <DataCell />;
        }
    }

    return <RenderTd />;
}

export default DataTableCell;
