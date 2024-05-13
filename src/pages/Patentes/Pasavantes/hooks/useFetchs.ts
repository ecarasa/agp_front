import {
    useGetRateCodesQuery,
    useLazyDownloadAttachedFileQuery,
    useLazyDownloadLiquidationPDFQuery,
    useLazyGetPatentQuery,
    useLiquidatePatentMutation,
    usePatentBillingRecordMutation
} from '../../../../services/patentsApi';
import { useGetCountriesQuery } from '../../../../services/shipsApi';

function useFetchs({ openShipDrawer, id }: any) {
    const [billingRegister, { isLoading: loadingRegistration }] = usePatentBillingRecordMutation();
    const [liquidatePatent, { isLoading: liquidating }] = useLiquidatePatentMutation();
    const [downloadAttachedFile, { isFetching: downloadingAttachedFile }] =
        useLazyDownloadAttachedFileQuery();
    const [getPatentById, { isLoading: loadingPatent, isFetching: fetchingPatent }] =
        useLazyGetPatentQuery();
    const [downloadPasavantePDF, { isLoading: downloadingPasavantePDF }] =
        useLazyDownloadLiquidationPDFQuery();

    const { data: countries, isLoading: loadingCountries } = useGetCountriesQuery(undefined, {
        skip: !openShipDrawer
    });
    const { data: rateCodes, isLoading: loadingRateCodes } = useGetRateCodesQuery(undefined, {
        skip: !id
    });

    return {
        billingRegister,
        downloadAttachedFile,
        getPatentById,
        liquidatePatent,
        downloadPasavantePDF,
        downloadingPasavantePDF,
        countries,
        rateCodes,
        loadingRateCodes,
        liquidating,
        loadingCountries,
        loadingPatent,
        fetchingPatent,
        loadingRegistration,
        downloadingAttachedFile
    };
}

export default useFetchs;
