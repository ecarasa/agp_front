import { capitalize } from '@mui/material';
import {
    useGetBuqueByIdQuery,
    useGetCountriesQuery,
    useGetShipHistoryQuery
} from '../../../../../services/shipsApi';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

function useShipHistory({ filters }: any) {
    const { id } = useParams();
    const [selected, setSelected] = useState<any>(null);
    const [openCard, setOpenCard] = useState<boolean>(false);
    const { data: countries } = useGetCountriesQuery({});
    const { data: shipData, isLoading: loadingShipData } = useGetBuqueByIdQuery(id);
    const {
        data: shipHistoryData,
        isLoading: loadingShipHipstoryData,
        isFetching: fetchingShipData
    } = useGetShipHistoryQuery(
        { id, filters },
        {
            refetchOnMountOrArgChange: true,
            skip: !id
        }
    );

    const handleOpenCard = () => {
        setOpenCard(true);
    };

    const handleCloseCard = () => {
        setOpenCard(false);
        setSelected(null);
    };

    const getModifiedData = (data: any) => {
        let string = '';

        if (!!data?.length) {
            data?.forEach((i: any, index: number) => {
                string += capitalize(i) + `${index + 1 === data?.length ? '' : ' / '}`;
            });
        }

        return string;
    };

    const handleSelectRow = (item: any) => {
        setSelected(item);
        handleOpenCard();
    };

    return {
        shipData,
        selected,
        openCard,
        countries,
        loadingShipData,
        shipHistoryData,
        fetchingShipData,
        loadingShipHipstoryData,
        handleOpenCard,
        getModifiedData,
        handleSelectRow,
        handleCloseCard
    };
}

export default useShipHistory;
