import {
    useEditShipMutation,
    useGetAssemblersQuery,
    useGetTenantsQuery,
    useLazyGetCitiesByCountryIdQuery,
    useShipDataValidationMutation
} from '../../../../../services/shipsApi';

function useFetchs() {
    const [getCitiesByCountryId, { isLoading: loadingCities, isFetching: fetchingCities }] =
        useLazyGetCitiesByCountryIdQuery();
    const { data: assemblers, isFetching: loadingAssemblers } = useGetAssemblersQuery({});
    const { data: tenants, isFetching: loadingTenants } = useGetTenantsQuery({});
    const [editShip, { isLoading: submitingData }] = useEditShipMutation();
    const [shipDataValidation] = useShipDataValidationMutation();

    return {
        getCitiesByCountryId,
        editShip,
        shipDataValidation,
        submitingData,
        loadingCities,
        fetchingCities,
        assemblers,
        tenants,
        loadingAssemblers,
        loadingTenants
    };
}

export default useFetchs;
