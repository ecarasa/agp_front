import { Checkbox } from '@mui/material';
import DataTable from '../../../../components/DataTable/DataTable';
import WagonStates from '../../components/WagonStates';

function WagonTable(props: any) {
    const {
        handleOpenCard,
        data,
        selected,
        userCompany,
        wagonsToChangeState,
        handleChangeWagonsToChangeState,
        disableCheckValidation
    } = props;
    const isAGP = userCompany?.id === 1;

    return (
        <>
            <DataTable
                headers={[
                    {
                        width: 3,
                        align: 'center',
                        type: isAGP ? 'selection' : '',
                        onClick: handleChangeWagonsToChangeState,
                        template: (item: any) =>
                            isAGP ? (
                                <Checkbox
                                    color={item?.estado === 'En Terminal' ? 'success' : 'primary'}
                                    readOnly={item?.estado === 'En Terminal'}
                                    disabled={disableCheckValidation(item)}
                                    checked={
                                        !!wagonsToChangeState?.find(
                                            (i: any) => i?.idVagon === item?.id
                                        ) || item?.estado === 'En Terminal'
                                    }
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            ) : null
                    },
                    {
                        titles: ['Vagón', 'Contenedor'],
                        upperLabel: (item: any) => item?.nroVagon || '',
                        lowerLabel: (item: any) => item?.nroContenedor || '',
                        noStyle: true,
                        width: 35
                    },
                    {
                        type: 'element',
                        template: (item: any) => {
                            return (
                                <div className="flex-align-center">
                                    <WagonStates
                                        states={{
                                            estado: item?.estado,
                                            estadoInspeccion: item?.inspeccion?.estado
                                        }}
                                    />
                                </div>
                            );
                        },
                        width: 35
                    },
                    {
                        width: 20,
                        titles: ['Precinto', 'Color'],
                        upperLabel: (item: any) => item?.nroPrecinto || '',
                        lowerLabel: (item: any) => item?.colorPrecinto || ''
                    }
                ]}
                onSelectRow={(item: any) => {
                    return handleOpenCard(item);
                }}
                filters={{ take: 0 }}
                items={{ data: { data: data?.vagones } } || []}
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

export default WagonTable;
