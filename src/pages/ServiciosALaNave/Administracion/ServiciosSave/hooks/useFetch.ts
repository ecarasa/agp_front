import {
    useAddServiceMutation,
    useEditServiceMutation,
    useGetManagementsQuery,
    useGetProvidersQuery,
    useGetShipServiceByIdQuery
} from '../../../../../services/shipServiceApi';

function useFetch(id: any) {
    const {
        data: gerencias,
        isLoading: loadingManagements,
        isFetching: fetchingManagements
    } = useGetManagementsQuery({});
    const {
        data: prestadores,
        isLoading: loadingPrestadores,
        isFetching: fetchingPrestadores
    } = useGetProvidersQuery({});
    const [addService, { isLoading: addingService }] = useAddServiceMutation();
    const [editService, { isLoading: edittingService }] = useEditServiceMutation();
    const {
        data: serviceById,
        isLoading: loadingServiceById,
        isFetching: fetchingServiceById,
        isError: serviceByIdError
    } = useGetShipServiceByIdQuery({ serviceId: id }, { skip: !id });

    return {
        addService,
        editService,
        edittingService,
        serviceById,
        loadingServiceById,
        fetchingServiceById,
        serviceByIdError,
        gerencias,
        prestadores,
        addingService,
        loadingManagements,
        fetchingManagements,
        loadingPrestadores,
        fetchingPrestadores
    };
}

export default useFetch;
