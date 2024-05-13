import { useGetShipServicesQuery } from '../../../../services/shipServiceApi';

function useServicios({ filters }: any) {
    const {
        data: servicios,
        isLoading: loadingServicios,
        isFetching: fetchingServicios
    } = useGetShipServicesQuery({ filters });

    return { servicios, loadingServicios, fetchingServicios };
}

export default useServicios;
