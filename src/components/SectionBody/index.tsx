import { memo } from 'react';
import { Table } from './Table';

function SectionBody({ children }: any) {
    return <>{children}</>;
}

SectionBody.Table = memo(Table);

export default SectionBody;
