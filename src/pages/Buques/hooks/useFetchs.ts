import {
    useEditCertificateMutation,
    useEditShipMutation,
    useGetAgenciesQuery,
    useGetBuqueByIdQuery,
    useGetBuquesQuery,
    useGetCountriesQuery,
    useGetParametricDataQuery,
    useLazyDownloadCertificateQuery,
    useLazyGetCertificatesByIdBuqueQuery
} from '../../../services/shipsApi';

function useFetchs({ selected, filters }: any) {
    const { data: agencies, isLoading: loadingAgencies } = useGetAgenciesQuery({});
    const { data: countries, isLoading: loadingCountries } = useGetCountriesQuery({});
    const [editShip, { isLoading: submitingData }] = useEditShipMutation();
    const [editCertificate, { isLoading: edittingCertificate }] = useEditCertificateMutation();
    const [downloadCertificate] = useLazyDownloadCertificateQuery();
    const [
        getCertificatesByIdBuque,
        { isFetching: gettingCertificates, error: certificatesError }
    ] = useLazyGetCertificatesByIdBuqueQuery({ refetchOnFocus: true });
    const { data: parametricData } = useGetParametricDataQuery({});
    const {
        data: shipById,
        isLoading: loadingShipFullData,
        isFetching: fetchingShipById
    } = useGetBuqueByIdQuery(selected?.id, {
        skip: !selected
    });
    const {
        data: shipsData,
        isLoading: loadingShipData,
        isFetching: fetchingShipData,
        refetch: refetchShipsData
    } = useGetBuquesQuery(
        { filters },
        {
            refetchOnReconnect: true,
            refetchOnMountOrArgChange: true
        }
    );

    return {
        shipsData,
        loadingShipData,
        fetchingShipData,
        submitingData,
        agencies,
        countries,
        loadingAgencies,
        loadingCountries,
        shipById,
        loadingShipFullData,
        fetchingShipById,
        certificatesError,
        edittingCertificate,
        gettingCertificates,
        parametricData,
        editShip,
        editCertificate,
        refetchShipsData,
        getCertificatesByIdBuque,
        downloadCertificate
    };
}

export default useFetchs;
