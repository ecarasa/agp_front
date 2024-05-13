import {
    useGetAgenciesQuery,
    useGetAssemblersQuery,
    useGetCountriesQuery,
    useGetParametricDataQuery,
    useGetTenantsQuery,
    useLazyGetCitiesByCountryIdQuery,
    useSaveShipMutation,
    useShipDataValidationMutation
} from '../../../../services/shipsApi';

function useFetchs() {
    const [getCitiesByCountryId, { isLoading: loadingCities, isFetching: fetchingCities }] =
        useLazyGetCitiesByCountryIdQuery();
    const { data: countries, isLoading: loadingCountries } = useGetCountriesQuery({});
    const [shipDataValidation, { isLoading: verifyingData }] = useShipDataValidationMutation();

    const [saveShip, { isLoading: postingShip }] = useSaveShipMutation();
    const { data: agencies, isLoading: loadingAgencies } = useGetAgenciesQuery(
        { activo: true },
        { refetchOnMountOrArgChange: true }
    );
    const { data: parametricData, isLoading: loadingParametricData } = useGetParametricDataQuery(
        {}
    );
    const { data: assemblers, isFetching: loadingAssemblers } = useGetAssemblersQuery({});
    const { data: tenants, isFetching: loadingTenants } = useGetTenantsQuery({});

    return {
        assemblers,
        tenants,
        loadingTenants,
        loadingAssemblers,
        agencies,
        countries,
        getCitiesByCountryId,
        loadingAgencies,
        loadingCities,
        loadingCountries,
        loadingParametricData,
        parametricData,
        postingShip,
        fetchingCities,
        saveShip,
        shipDataValidation,
        verifyingData
    };
}

export default useFetchs;
