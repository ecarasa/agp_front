import { useEffect, useState } from 'react';
import useGlobalFilters from '../../../hooks/useGlobalFilters';
import { useGetPublicNewsQuery } from '../../../services/newsApi';

function useContent() {
    const { filters, setFilters } = useGlobalFilters({ skip: 0, take: 9 });
    const [items, setItems] = useState<any>([]);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const {
        data: news,
        refetch: refetchPublicData,
        isLoading,
        isFetching
    } = useGetPublicNewsQuery({ filters }, { refetchOnMountOrArgChange: true });

    useEffect(() => {
        if (!!news?.data?.data?.length) {
            const uniqueObjects = [...news?.data?.data, ...items].reduce((acc, current) => {
                const x = acc.find((item: any) => item.id === current.id);
                return !x ? acc.concat([current]) : acc;
            }, []);
            setItems(uniqueObjects);
        }
        // eslint-disable-next-line
    }, [news]);

    const handleLoadMore = () => {
        setFilters({
            ...filters,
            skip: filters?.skip + filters?.take
        });
    };

    return {
        news,
        items,
        isLoading,
        isFetching,
        selectedItem,
        refetchPublicData,
        setSelectedItem,
        handleLoadMore
    };
}

export default useContent;
