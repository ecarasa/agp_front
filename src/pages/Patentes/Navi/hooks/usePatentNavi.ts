import { useGetPatentsQuery } from '../../../../services/patentsApi';

function usePatentNavi({ filters }: any) {
    const {
        data: patents,
        isLoading: loadingPatents,
        isFetching: fetchingPatents
    } = useGetPatentsQuery({ filters }, { refetchOnMountOrArgChange: true });

    return { patents, loadingPatents, fetchingPatents };
}

export default usePatentNavi;
