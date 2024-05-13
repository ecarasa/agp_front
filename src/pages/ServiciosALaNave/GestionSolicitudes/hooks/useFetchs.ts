import {
    useCancelRequestMutation,
    useGetManagementsQuery,
    useGetServiceRequestByIdQuery,
    useGetServiceRequestsQuery,
    useGetServicesQuery,
    useGetShipServiceByIdQuery,
    useLogAttributesMutation
} from '../../../../services/shipServiceApi';

function useFetchs({ selected, filters }: any) {
    const { data: services, isLoading: loadingServices } = useGetServicesQuery({});
    const [logAttributes, { isLoading: loadingLogAttributes }] = useLogAttributesMutation();
    const [cancelRequest, { isLoading: cancelingRequest }] = useCancelRequestMutation();

    const {
        data: gerencias,
        isLoading: loadingManagements,
        isFetching: fetchingManagements
    } = useGetManagementsQuery({});

    const {
        data: requestById,
        isLoading: loadingRequestData,
        isFetching: fetchingRequestData
    } = useGetServiceRequestByIdQuery(selected?.id, { skip: !selected });

    const {
        data: requests,
        isLoading: loadingRequests,
        isFetching: fetchingRequests,
        isError
    } = useGetServiceRequestsQuery({ filters });

    const {
        data: serviceData,
        isLoading: loadingServiceData,
        isFetching: fetchingServiceData
    } = useGetShipServiceByIdQuery(
        { serviceId: selected?.servicio?.id },
        {
            skip: !selected
        }
    );

    return {
        serviceData,
        requests,
        requestById,
        gerencias,
        services,
        loadingServiceData,
        fetchingServiceData,
        loadingRequests,
        fetchingRequests,
        loadingRequestData,
        fetchingRequestData,
        loadingServices,
        loadingManagements,
        fetchingManagements,
        isError,
        cancelingRequest,
        loadingLogAttributes,
        logAttributes,
        cancelRequest
    };
}

export default useFetchs;
