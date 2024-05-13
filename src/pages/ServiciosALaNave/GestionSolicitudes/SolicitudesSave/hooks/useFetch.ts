import {
    useAddServiceRequestMutation,
    useGetServicesQuery,
    useGetShipsForServicesQuery
} from '../../../../../services/shipServiceApi';

function useFetch({ filters }: any) {
    const {
        data: ships,
        isLoading: loadingShips,
        isFetching: fetchingShips
    } = useGetShipsForServicesQuery(
        { filters },
        {
            skip: !filters?.nombre,
            refetchOnMountOrArgChange: true
        }
    );
    const { data: services, isLoading: loadingServices } = useGetServicesQuery({
        estado: 'activo'
    });
    const [addServiceRequest, { isLoading: addingServiceRequest }] = useAddServiceRequestMutation();

    return {
        ships,
        loadingShips,
        fetchingShips,
        services,
        loadingServices,
        addingServiceRequest,
        addServiceRequest
    };
}

export default useFetch;
