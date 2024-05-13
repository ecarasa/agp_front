import { Box } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DataTable from '../../../../../components/DataTable/DataTable';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function AttributesTable(props: any) {
    const { selected, handleOpenCard, data } = props;

    return (
        <>
            <DataTable
                headers={[
                    {
                        upperLabel: (item: any) => item?.nombre || '',
                        width: 35
                    },
                    {
                        type: 'element',
                        template: (item: any) => {
                            return (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginLeft: '12px',
                                        '& span': {
                                            marginLeft: '5px'
                                        }
                                    }}
                                >
                                    {item?.activo ? (
                                        <CheckCircleRoundedIcon color="success" />
                                    ) : (
                                        <InfoOutlinedIcon color="primary" />
                                    )}
                                    <span>{item?.activo ? 'Activo' : 'Inactivo'}</span>
                                </Box>
                            );
                        },
                        width: 35
                    },
                    {
                        width: 20,
                        noStyle: true,
                        upperLabel: (item: any) =>
                            item?.obligatorio ? 'Obligatorio' : 'No obligatorio',
                        lowerLabel: (item: any) => (item?.requiereAdjunto ? 'Requiere Adjunto' : '')
                    }
                ]}
                onSelectRow={(item: any) => {
                    return handleOpenCard(item);
                }}
                filters={{ take: 0 }}
                items={{ data: { data: data?.atributos || [] } }}
                noPaginated
                selected={selected}
                style={{
                    overflowY: 'auto',
                    maxHeight: '510px'
                }}
            />
        </>
    );
}

export default AttributesTable;
