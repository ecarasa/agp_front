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

export const shipServiceApi = createApi({
    reducerPath: 'serviciosNave',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Services', 'ServiceById', 'RequestById', 'ServiceRequests'],
    endpoints: (builder) => ({
        getManagements: builder.query({
            query: () => ({
                url: 'servicios-nave/datos-parametricos/gerencias'
            }),
            transformResponse: (response: { data: { gerencias: any } }) => response?.data?.gerencias
        }),
        getServices: builder.query({
            query: (filters: any) => ({
                url: 'servicios-nave/datos-parametricos/servicios',
                params: !!Object.keys(filters)?.length ? filters : null
            }),
            transformResponse: (response: { data: { servicios: any } }) => response?.data?.servicios
        }),
        getRateCodes: builder.query({
            query: () => ({
                url: 'servicios-nave/datos-parametricos/codigos-tarifa'
            }),
            transformResponse: (response: { data: { codigos: any } }) => response?.data?.codigos
        }),
        getProviders: builder.query({
            query: () => ({
                url: 'servicios-nave/datos-parametricos/prestadores'
            }),
            transformResponse: (response: { data: { prestadores: any } }) =>
                response?.data?.prestadores
        }),
        addService: builder.mutation({
            query: (body) => ({
                url: 'servicios-nave',
                method: 'POST',
                body: body
            }),
            invalidatesTags: (_, error) => (error ? [] : ['ServiceById', 'Services'])
        }),
        editService: builder.mutation({
            query: ({ serviceId, body }: any) => ({
                url: `servicios-nave/${serviceId}`,
                method: 'PATCH',
                body: body
            }),
            invalidatesTags: (_, error) => (error ? [] : ['ServiceById', 'Services'])
        }),
        getShipServices: builder.query({
            query: ({ filters }) => ({
                url: 'servicios-nave',
                params: filters
            }),
            providesTags: ['Services']
        }),
        getShipServiceById: builder.query({
            query: ({ serviceId }) => ({
                url: `servicios-nave/${serviceId}`
            }),
            providesTags: ['ServiceById'],
            transformResponse: (response: { data: any }) => response?.data
        }),
        getShipsForServices: builder.query({
            query: ({ filters }) => ({
                url: 'servicios-nave/buques',
                params: filters
            }),
            transformResponse: (response: { data: { buques: any } }) => response?.data?.buques
        }),
        addServiceRequest: builder.mutation({
            query: ({ body }) => ({
                url: 'servicios-nave/solicitudes',
                method: 'POST',
                body: body
            }),
            invalidatesTags: (_, error) => (error ? [] : ['ServiceRequests'])
        }),
        getServiceRequests: builder.query({
            query: ({ filters }) => ({
                url: 'servicios-nave/solicitudes',
                params: filters
            }),
            providesTags: ['ServiceRequests']
        }),
        getServiceRequestById: builder.query({
            query: (requestId) => ({
                url: `servicios-nave/solicitudes/${requestId}`
            }),
            providesTags: ['RequestById'],
            transformResponse: (response: { data: any }) => response?.data
        }),
        logAttributes: builder.mutation({
            query: ({ requestId, body }) => ({
                url: `servicios-nave/solicitudes/${requestId}/provision`,
                method: 'POST',
                body: body
            }),
            invalidatesTags: (_, error) => (error ? [] : ['ServiceRequests', 'RequestById'])
        }),
        liquidateService: builder.mutation({
            query: ({ requestId, body }) => ({
                url: `servicios-nave/solicitudes/${requestId}/liquidacion`,
                method: 'POST',
                body: body
            }),
            invalidatesTags: (_, error) => (error ? [] : ['ServiceRequests', 'RequestById'])
        }),
        downloadAttachedFile: builder.query({
            query: ({ requestId, billingNumber }) => ({
                url: `servicios-nave/solicitudes/${requestId}/liquidacion/${billingNumber}`
            }),
            transformResponse: (response: { data: { presignedUrl: string } }) =>
                response?.data?.presignedUrl
        }),
        cancelRequest: builder.mutation({
            query: ({ requestId, body }) => ({
                url: `servicios-nave/solicitudes/${requestId}`,
                method: 'PATCH',
                body: body
            }),
            invalidatesTags: (_, error) => (error ? [] : ['ServiceRequests', 'RequestById'])
        })
    })
});

export const {
    useCancelRequestMutation,
    useLazyDownloadAttachedFileQuery,
    useLiquidateServiceMutation,
    useGetRateCodesQuery,
    useLogAttributesMutation,
    useGetServiceRequestByIdQuery,
    useGetServiceRequestsQuery,
    useAddServiceRequestMutation,
    useGetShipsForServicesQuery,
    useEditServiceMutation,
    useGetShipServiceByIdQuery,
    useGetShipServicesQuery,
    useGetManagementsQuery,
    useGetServicesQuery,
    useGetProvidersQuery,
    useAddServiceMutation
} = shipServiceApi;
