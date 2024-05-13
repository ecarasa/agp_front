import { useGetCompaniesQuery, useGetRailwayCompaniesQuery } from '../../../services/railwaysApi';

function useFilters() {
    const { data: empresas, isLoading: loadingEmpresas } = useGetCompaniesQuery({});
    const { data: agenciasFerroviarias, isLoading: loadingAgencies } = useGetCompaniesQuery({
        filters: { perfil: 11 }
    });
    const { data: ferrocarriles, isLoading: loadingFerrocarriles } = useGetRailwayCompaniesQuery(
        {}
    );

    return {
        empresas,
        ferrocarriles,
        loadingEmpresas,
        agenciasFerroviarias,
        loadingFerrocarriles,
        loadingAgencies
    };
}

export default useFilters;
