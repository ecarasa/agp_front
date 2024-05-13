import { useState } from 'react';
import { useGetGirosQuery } from '../../../../services/girosApi';

function useNavi({ filters }: any) {
    const [openCard, setOpenCard] = useState<any>();

    const {
        data: dataGiros,
        isLoading: loadingGirosData,
        isFetching: fetchinGirosData
    } = useGetGirosQuery(
        { filters },
        {
            refetchOnMountOrArgChange: true
        }
    );

    return {
        openCard,
        dataGiros,
        loadingGirosData,
        fetchinGirosData,
        setOpenCard
    };
}

export default useNavi;
