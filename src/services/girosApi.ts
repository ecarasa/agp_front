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

export const girosApi = createApi({
    reducerPath: 'giros',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Giros'],
    endpoints: (builder) => ({
        getTerminals: builder.query<any, void>({
            query: () => ({ url: 'giros/terminales' }),
            transformResponse: (response: { data: { terminales: any } }) =>
                response?.data?.terminales
        }),
        getPorts: builder.query<any, void>({
            query: () => ({
                url: 'giros/puertos'
            }),
            transformResponse: (response: { data: { puertos: any } }) => response?.data?.puertos
        }),
        validateMovs: builder.mutation({
            query: (data) => ({
                url: 'giros/validar-datos',
                body: data,
                method: 'POST'
            })
        }),
        getAssemblersAndTenants: builder.query<any, void>({
            query: () => ({
                url: 'giros/armadores-y-locatarios'
            }),
            transformResponse: (response: { data: { empresas: any } }) => response?.data?.empresas
        }),
        getChargeTypes: builder.query<any, void>({
            query: () => ({
                url: 'giros/tipos-carga'
            }),
            transformResponse: (response: { data: { tiposCarga: any } }) =>
                response?.data?.tiposCarga
        }),
        getGiros: builder.query({
            query: ({ filters }) => ({
                url: '/giros',
                params: filters
            }),
            providesTags: ['Giros']
        }),
        getBlkData: builder.query({
            query: (params) => ({
                url: '/blockchain',
                params
            }),
            providesTags: ['Giros']
        }),
        validateBlkData: builder.mutation({
            query: ({ body, idGiro }) => ({
                url: `giros/${idGiro}/validar-datos-blockchain`,
                method: 'POST',
                body
            })
        }),
        dowloadBlkPdf: builder.query({
            query: (txId) => ({
                url: `blockchain/pdf/${txId}`
            }),
            transformResponse: (response: { data: { pdf: any } }) => response?.data?.pdf
        }),
        addNewdocking: builder.mutation({
            query: (data) => ({
                url: 'giros',
                method: 'POST',
                body: data
            })
        }),
        dockingUploadFiles: builder.mutation({
            query: ({ idGiro, file }) => ({
                url: `giros/${idGiro}/adjunto`,
                body: file,
                method: 'POST'
            })
        }),
        historyConversation: builder.query<any, void>({
            query: (idGiro) => `giros/${idGiro}/conversacion`,
            transformResponse: (response: { data: { historial: any } }) => response?.data?.historial
        }),
        getGiroById: builder.query({
            query: (idGiro) => ({
                url: `giros/${idGiro}`
            }),
            transformResponse: (response: { data: { giro: any } }) => response?.data?.giro
        }),
        answerParametrics: builder.query<any, void>({
            query: (idGiro) => ({
                url: `giros/${idGiro}/conversacion/respuestas`
            }),
            transformResponse: (response: { data: { respuestas: any } }) =>
                response?.data?.respuestas
        }),
        postAnswer: builder.mutation({
            query: ({ idGiro, idRespuesta, data }) => ({
                url: `giros/${idGiro}/conversacion/respuestas/${idRespuesta}`,
                method: 'POST',
                body: data
            })
        }),
        downloadFile: builder.query({
            query: (idGiro) => ({
                url: `giros/${idGiro}/pdf`
            }),
            transformResponse: (response: { data: { pdf: any } }) => response?.data?.pdf
        }),
        getMovementsHistory: builder.query({
            query: (idGiro) => ({
                url: `giros/${idGiro}/movimientos/historico`
            }),
            transformResponse: (response: { data: { historial: any } }) => response?.data?.historial
        }),
        getTrafficTypes: builder.query({
            query: () => ({
                url: 'giros/tipos-trafico'
            }),
            transformResponse: (response: { data: { tiposTrafico: any } }) =>
                response?.data?.tiposTrafico
        }),
        getOperationTypes: builder.query({
            query: () => ({
                url: 'giros/tipos-operacion'
            }),
            transformResponse: (response: { data: { tiposOperacion: any } }) =>
                response?.data?.tiposOperacion
        }),
        updateTripData: builder.mutation({
            query: ({ idGiro, data }) => ({
                url: `giros/${idGiro}/linea-vanguardia`,
                method: 'PATCH',
                body: data
            })
        }),
        updateMovement: builder.mutation({
            query: ({ idGiro, idMove, data }) => ({
                url: `giros/${idGiro}/movimientos/${idMove}`,
                method: 'PATCH',
                body: data
            })
        }),
        billingRecord: builder.mutation({
            query: ({ idGiro, formData }) => ({
                url: `giros/${idGiro}/facturacion`,
                method: 'POST',
                body: formData
            })
        }),
        postReviewNote: builder.mutation({
            query: ({ idGiro, body }) => ({
                url: `giros/${idGiro}/revision`,
                body: body,
                method: 'PATCH'
            })
        }),
        finishDockingReview: builder.mutation({
            query: ({ idGiro, data }) => ({
                url: `giros/${idGiro}`,
                method: 'PATCH',
                body: data
            })
        }),
        addNewMov: builder.mutation({
            query: ({ idGiro, data }) => ({
                url: `giros/${idGiro}/movimientos`,
                method: 'POST',
                body: data
            })
        }),
        deleteMove: builder.mutation({
            query: ({ idGiro, idMovement }) => ({
                url: `giros/${idGiro}/movimientos/${idMovement}`,
                method: 'DELETE'
            })
        }),
        renewalDocking: builder.mutation({
            query: ({ idGiro, idMovement }) => ({
                url: `giros/${idGiro}/movimientos/${idMovement}/renovacion`,
                method: 'POST'
            })
        }),
        getRateCodes: builder.query({
            query: () => ({
                url: 'giros/codigos-tarifa'
            }),
            transformResponse: (response: { data: { codigos: any } }) => response?.data?.codigos
        }),
        liquidateDocking: builder.mutation({
            query: (idGiro) => ({
                url: `giros/${idGiro}/liquidacion`,
                method: 'POST'
            })
        }),
        downloadAttachedFile: builder.query({
            query: ({ idGiro, nroFactura }) => ({
                url: `giros/${idGiro}/facturacion/${nroFactura}`
            }),
            transformResponse: (response: { data: any }) => response?.data
        }),
        downloadPasavantePDF: builder.query({
            query: (idGiro) => ({
                url: `giros/${idGiro}/pasavante/pdf`
            }),
            transformResponse: (response: { data: { pdf: any } }) => response?.data?.pdf
        })
    })
});

export const {
    useLazyDownloadPasavantePDFQuery,
    useLazyDownloadAttachedFileQuery,
    useLiquidateDockingMutation,
    useGetRateCodesQuery,
    useRenewalDockingMutation,
    useDeleteMoveMutation,
    useAddNewMovMutation,
    useFinishDockingReviewMutation,
    usePostReviewNoteMutation,
    useBillingRecordMutation,
    useUpdateMovementMutation,
    useUpdateTripDataMutation,
    useGetOperationTypesQuery,
    useGetTrafficTypesQuery,
    useGetMovementsHistoryQuery,
    useLazyDownloadFileQuery,
    usePostAnswerMutation,
    useLazyAnswerParametricsQuery,
    useLazyGetGiroByIdQuery,
    useLazyHistoryConversationQuery,
    useDockingUploadFilesMutation,
    useAddNewdockingMutation,
    useGetChargeTypesQuery,
    useGetTerminalsQuery,
    useGetPortsQuery,
    useValidateMovsMutation,
    useGetAssemblersAndTenantsQuery,
    useGetGirosQuery,
    useLazyGetBlkDataQuery,
    useLazyDowloadBlkPdfQuery,
    useValidateBlkDataMutation
} = girosApi;
