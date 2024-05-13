import {
    useBillingRecordMutation,
    useGetGirosQuery,
    useGetRateCodesQuery,
    useLazyDownloadAttachedFileQuery,
    useLazyDownloadPasavantePDFQuery,
    useLazyGetGiroByIdQuery,
    useLiquidateDockingMutation,
    usePostReviewNoteMutation
} from '../../../../services/girosApi';
import {
    useGetAgenciesQuery,
    useGetAssemblersQuery,
    useGetCountriesQuery
} from '../../../../services/shipsApi';

function useFetchs({ id, openShipDrawer, filters }: any) {
    const [liquidateDocking, { isLoading: liquidating }] = useLiquidateDockingMutation();
    const { data: rateCodes, isLoading: loadingRateCodes } = useGetRateCodesQuery(undefined, {
        skip: !id
    });
    const { data: countries, isLoading: loadingCountries } = useGetCountriesQuery(undefined, {
        skip: !openShipDrawer
    });
    const [downloadPasavantePDF, { isFetching: downloadingPasavantePDF }] =
        useLazyDownloadPasavantePDFQuery();
    const [getGiroById, { isLoading: loadingData, isFetching: fetchingData }] =
        useLazyGetGiroByIdQuery();
    const [billingRegister, { isLoading: loadingRegistration }] = useBillingRecordMutation();
    const [postReviewNote, { isLoading: postingReviewNote }] = usePostReviewNoteMutation();
    const { data: assemblers, isLoading: loadingAssemblers } = useGetAssemblersQuery({});
    const { data: agencies, isLoading: loadingAgencies } = useGetAgenciesQuery({});
    const [downloadAttachedFile, { isFetching: downloadingAttachedFile }] =
        useLazyDownloadAttachedFileQuery();

    const {
        data: dataGiros,
        isLoading: loadingDataGiros,
        isFetching: fetchinDataGiros
    } = useGetGirosQuery(
        {
            filters: {
                ...filters,
                estadoGiro: filters?.estadoGiro || 'pasavante'
            }
        },
        {
            refetchOnMountOrArgChange: true
        }
    );

    return {
        dataGiros,
        loadingDataGiros,
        fetchinDataGiros,
        loadingCountries,
        countries,
        downloadingPasavantePDF,
        postingReviewNote,
        agencies,
        loadingData,
        fetchingData,
        assemblers,
        loadingAssemblers,
        liquidating,
        loadingAgencies,
        loadingRegistration,
        rateCodes,
        loadingRateCodes,
        downloadingAttachedFile,
        downloadPasavantePDF,
        getGiroById,
        downloadAttachedFile,
        postReviewNote,
        billingRegister,
        liquidateDocking
    };
}

export default useFetchs;
