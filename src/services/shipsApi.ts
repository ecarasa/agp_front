import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { logout, tokenReceived } from '../features/auth/authSlice';
import { RootState } from '../redux/store';
import { settings } from '../settings';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

const baseQuery = fetchBaseQuery({
    baseUrl: `${settings.url.host}${settings.url.api}`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const accessToken = (getState() as RootState).auth.accessToken;
        if (accessToken) {
            headers.set('authorization', `Bearer ${accessToken}`);
        }
        return headers;
    }
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result: any = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const { auth }: any = api.getState();
        const refreshResult = await baseQuery(
            {
                url: '/auth/refresh-token',
                method: 'POST',
                credentials: 'include',
                body: { username: auth?.user?.usuario }
            },
            api,
            extraOptions
        );
        if (refreshResult?.data) {
            api.dispatch(tokenReceived(refreshResult.data));
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    }
    return result;
};

export const shipsApi = createApi({
    reducerPath: 'ships',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Ships', 'ShipById'],
    endpoints: (builder) => ({
        getParametricData: builder.query({
            query: () => ({ url: 'buques/datos-parametricos' }),
            keepUnusedDataFor: 60 * 60 * 12,
            transformResponse: (response: { data: any }) => response?.data
        }),
        getCountries: builder.query({
            query: () => ({ url: 'buques/datos-parametricos/paises' }),
            keepUnusedDataFor: 60 * 60 * 12,
            transformResponse: (response: { data: { paises: any } }) => response?.data?.paises
        }),
        getCitiesByCountryId: builder.query({
            query: (idPais) => ({ url: `buques/datos-parametricos/paises/${idPais}/ciudades` }),
            keepUnusedDataFor: 60 * 60 * 12,
            transformResponse: (response: { data: any }) => response?.data
        }),
        shipDataValidation: builder.mutation({
            query: (body) => ({
                url: 'buques/validar-datos',
                body: body,
                method: 'POST'
            })
        }),
        getAssemblers: builder.query({
            query: () => ({ url: 'buques/armadores' }),
            transformResponse: (response: { data: any }) => response?.data?.armadores
        }),
        getTenants: builder.query({
            query: () => ({ url: 'buques/locatarios' }),
            transformResponse: (response: { data: any }) => response?.data
        }),
        getAssemblersByName: builder.query({
            query: (name) => ({ url: `buques/armadores?nombre=${name}` })
        }),
        getTenantsByName: builder.query({
            query: (name) => ({ url: `buques/locatarios?nombre=${name}` })
        }),
        saveShip: builder.mutation({
            query: (body) => ({ url: 'buques', method: 'POST', body: body })
        }),
        addCertificate: builder.mutation({
            query: ({ bodyFormData, idBuque, idCertificate }: any) => ({
                url: `buques/${idBuque}/certificados/tipos/${idCertificate}`,
                method: 'POST',
                body: bodyFormData
            })
        }),
        getBuques: builder.query({
            query: ({ filters }) => ({
                url: '/buques',
                params: filters
            }),
            providesTags: ['Ships']
        }),
        getBuquesFromGiros: builder.query({
            queryFn(args, api, extraOptions, baseQuery) {
                const filters = { ...args };
                delete filters?.estado;
                delete filters?.activo;
                const extraFilters = { ...args };
                return baseQuery({
                    url: `buques?activo=${extraFilters.activo}&estado=${extraFilters.estado[0]}&estado=${extraFilters.estado[1]}`,
                    params: filters
                });
            }
        }),
        getCertificatesByIdBuque: builder.query({
            query: (idBuque) => ({ url: `buques/${idBuque}/certificados` }),
            transformResponse: (response: { data: any }) => response?.data
        }),
        deleteCertificate: builder.mutation({
            query: ({ idBuque, uuid }: any) => ({
                url: `buques/${idBuque}/certificados/${uuid}`,
                method: 'DELETE'
            })
        }),
        getBuqueById: builder.query({
            query: (idBuque) => ({
                url: `buques/${idBuque}`
            }),
            providesTags: ['ShipById']
        }),
        assignCertificates: builder.mutation({
            query: (idBuque) => ({
                url: `buques/${idBuque}/asignacion-certificados`,
                method: 'POST'
            })
        }),
        editShip: builder.mutation({
            query: ({ data, idBuque }) => ({
                url: `buques/${idBuque}`,
                method: data?.aprobar || data?.nota ? 'POST' : 'PATCH',
                body: data
            }),
            invalidatesTags: (_, error) => (error ? [] : ['Ships', 'ShipById'])
        }),
        editCertificate: builder.mutation({
            query: ({ idBuque, idCertificate, data }) => ({
                url: `buques/${idBuque}/certificados/${idCertificate}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (_, error) => (error ? [] : ['ShipById'])
        }),
        downloadCertificate: builder.query({
            query: ({ idBuque, idCertificate }) => ({
                url: `buques/${idBuque}/certificados/${idCertificate}`
            }),
            transformResponse: (response: { data: any }) => response?.data
        }),
        getShipHistory: builder.query({
            query: ({ id, filters }) => ({
                url: `buques/${id}/historico`,
                params: filters
            })
        }),
        getShipCertificatesHistory: builder.query({
            query: ({ shipId, certificateId, filters }: any) => ({
                url: `buques/${shipId}/tipo-certificado/${certificateId}/historico`,
                params: filters
            })
        }),
        getAgencies: builder.query({
            query: (filters) => ({
                url: 'buques/agencias-maritimas',
                params: filters
            }),
            transformResponse: (response: { data: { agenciasMaritimas: any } }) =>
                response?.data?.agenciasMaritimas
        })
    })
});

export const {
    useLazyGetAgenciesQuery,
    useGetAgenciesQuery,
    useGetShipCertificatesHistoryQuery,
    useGetShipHistoryQuery,
    useGetBuqueByIdQuery,
    useLazyGetBuquesFromGirosQuery,
    useLazyGetBuquesQuery,
    useLazyDownloadCertificateQuery,
    useEditCertificateMutation,
    useGetCountriesQuery,
    useLazyGetCitiesByCountryIdQuery,
    useEditShipMutation,
    useLazyGetBuqueByIdQuery,
    useAssignCertificatesMutation,
    useGetCitiesByCountryIdQuery,
    useLazyGetCertificatesByIdBuqueQuery,
    useAddCertificateMutation,
    useGetAssemblersQuery,
    useGetTenantsQuery,
    useGetAssemblersByNameQuery,
    useGetTenantsByNameQuery,
    useGetParametricDataQuery,
    useShipDataValidationMutation,
    useLazyGetAssemblersByNameQuery,
    useLazyGetTenantsByNameQuery,
    useSaveShipMutation,
    useGetBuquesQuery,
    useDeleteCertificateMutation
} = shipsApi;
