import { useGetNewsQuery } from '../../../services/newsApi';
import { useEffect, useState } from 'react';
import useGlobalFilters from '../../../hooks/useGlobalFilters';

function useNews() {
    const { filters, setFilters } = useGlobalFilters({ skip: 0, take: 9 });
    const [items, setItems] = useState<any>([]);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const {
        data: news,
        isLoading: loadingNews,
        isFetching: fetchingNews
    } = useGetNewsQuery({ filters }, { refetchOnMountOrArgChange: true });

    useEffect(() => {
        if (!!news?.data?.data?.length) {
            setItems(items.concat(news?.data?.data));
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
        loadingNews,
        selectedItem,
        fetchingNews,
        setSelectedItem,
        handleLoadMore
    };
}

export default useNews;
