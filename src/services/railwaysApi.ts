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

export const railwaysApi = createApi({
    reducerPath: 'railway',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Formaciones', 'DetailById'],
    endpoints: (builder) => ({
        getRailwayCompanies: builder.query({
            query: ({ filters }) => ({
                url: 'formaciones-ferroviarias/datos-parametricos/ferrocarriles',
                params: filters
            }),
            transformResponse: (response: { data: { ferrocarriles: object[] } }) =>
                response?.data?.ferrocarriles
        }),
        getCompanies: builder.query({
            query: ({ filters }) => ({
                url: 'formaciones-ferroviarias/datos-parametricos/empresas',
                params: filters
            }),
            transformResponse: (response: { data: { empresas: object[] } }) =>
                response?.data?.empresas
        }),
        getCities: builder.query({
            query: ({ filters }) => ({
                url: 'formaciones-ferroviarias/datos-parametricos/ciudades',
                params: filters
            }),
            transformResponse: (response: { data: { ciudades: object[] } }) =>
                response?.data?.ciudades
        }),
        createWaybill: builder.mutation({
            query: (body) => ({
                url: `formaciones-ferroviarias/cartas-porte`,
                method: 'POST',
                body: body
            })
        }),
        getWaybills: builder.query({
            query: ({ filters }) => ({
                url: 'formaciones-ferroviarias/cartas-porte',
                params: filters
            })
        }),
        getWaybillById: builder.query({
            query: (id) => ({
                url: `formaciones-ferroviarias/cartas-porte/${id}`
            }),
            providesTags: ['DetailById'],
            transformResponse: (response: { data: any }) => response?.data
        }),
        updateWaybillWagon: builder.mutation({
            query: ({ waybillId, wagonNumber, body }) => ({
                url: `formaciones-ferroviarias/cartas-porte/${waybillId}/vagones/${wagonNumber}`,
                method: 'POST',
                body: body
            })
        }),
        getRejectMotives: builder.query({
            query: () => ({
                url: 'formaciones-ferroviarias/datos-parametricos/tipos-inconvenientes'
            }),
            transformResponse: (response: { data: { tiposInconvenientes: any } }) =>
                response?.data?.tiposInconvenientes
        }),
        editWaybill: builder.mutation({
            query: ({ id, body }) => ({
                url: `formaciones-ferroviarias/cartas-porte/${id}`,
                method: 'PATCH',
                body: body
            }),
            invalidatesTags: (_, error) => (error ? [] : ['DetailById'])
        }),
        downloadWaybillFile: builder.query({
            query: (id) => ({
                url: `formaciones-ferroviarias/cartas-porte/${id}/pdf`
            }),
            transformResponse: (response: { data: { pdf: any } }) => response?.data?.pdf
        }),
        getParrillas: builder.query({
            query: () => ({
                url: 'formaciones-ferroviarias/datos-parametricos/parrillas'
            }),
            transformResponse: (response: { data: { parrillas: any } }) => response?.data?.parrillas
        }),
        createRailway: builder.mutation({
            query: ({ body }) => ({
                url: 'formaciones-ferroviarias',
                method: 'POST',
                body: body
            })
        }),
        getFormacionesFerroviarias: builder.query({
            query: ({ filters }) => ({
                url: 'formaciones-ferroviarias',
                params: filters
            }),
            providesTags: ['Formaciones']
        }),
        getWaybillsByFormacionId: builder.query({
            query: ({ id, filters }) => ({
                url: `formaciones-ferroviarias/${id}/cartas-porte`,
                params: filters
            }),
            keepUnusedDataFor: 60 * 60
        }),
        deleteRailway: builder.mutation({
            query: (id) => ({
                url: `formaciones-ferroviarias/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (_, error) => (error ? [] : ['Formaciones'])
        }),
        internalMovements: builder.mutation({
            query: ({ waybillId, body }) => ({
                url: `formaciones-ferroviarias/cartas-porte/${waybillId}/movimientos-internos`,
                method: 'PATCH',
                body: body
            }),
            invalidatesTags: (_, error) => (error ? [] : ['DetailById'])
        })
    })
});

export const {
    useInternalMovementsMutation,
    useDeleteRailwayMutation,
    useGetWaybillsByFormacionIdQuery,
    useGetFormacionesFerroviariasQuery,
    useCreateRailwayMutation,
    useGetParrillasQuery,
    useLazyDownloadWaybillFileQuery,
    useEditWaybillMutation,
    useGetRejectMotivesQuery,
    useUpdateWaybillWagonMutation,
    useGetWaybillByIdQuery,
    useLazyGetWaybillByIdQuery,
    useGetWaybillsQuery,
    useCreateWaybillMutation,
    useGetCitiesQuery,
    useGetCompaniesQuery,
    useGetRailwayCompaniesQuery
} = railwaysApi;
