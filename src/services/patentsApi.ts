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

export const patentsApi = createApi({
    reducerPath: 'patents',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        validatePatents: builder.mutation({
            query: (body) => ({
                url: 'patentes/validar-datos',
                method: 'POST',
                body: body
            }),
            transformResponse: (response: any) => response?.data
        }),
        addPatent: builder.mutation({
            query: (body) => ({
                url: 'patentes',
                method: 'POST',
                body: body
            })
        }),
        downloadPatentPDF: builder.query({
            query: (patentId) => ({
                url: `patentes/${patentId}/pdf`
            }),
            transformResponse: (response: { data: { pdf: any } }) => response?.data?.pdf
        }),
        getPatents: builder.query({
            query: ({ filters }) => ({
                url: 'patentes',
                params: filters
            })
        }),
        getPatent: builder.query({
            query: (id) => ({
                url: `patentes/${id}`
            }),
            transformResponse: (response: { data: { patente: any } }) => response?.data?.patente
        }),
        getAnswers: builder.query({
            query: (patentId) => ({
                url: `patentes/${patentId}/conversacion/respuestas`
            }),
            transformResponse: (response: { data: { respuestas: any } }) =>
                response?.data?.respuestas
        }),
        postPatentAnswer: builder.mutation({
            query: ({ patentId, responseId, body }) => ({
                url: `patentes/${patentId}/conversacion/respuestas/${responseId}`,
                body: body,
                method: 'POST'
            })
        }),
        getConversation: builder.query<any, void>({
            query: (patentId) => `patentes/${patentId}/conversacion`,
            transformResponse: (response: { data: { historial: any } }) => response?.data?.historial
        }),
        unsubscribePatent: builder.mutation({
            query: ({ patentId, body }) => ({
                url: `patentes/${patentId}`,
                method: 'PATCH',
                body: body
            })
        }),
        addOperation: builder.mutation({
            query: ({ patentId, body }) => ({
                url: `patentes/${patentId}/estadias`,
                method: 'POST',
                body: body
            })
        }),
        getPatentOperations: builder.query({
            query: ({ patentId, filters }) => ({
                url: `patentes/${patentId}/estadias`,
                params: filters
            })
        }),
        getDockingByPatentId: builder.query({
            query: (patentId) => ({
                url: `patentes/${patentId}/estadias/muelles`
            }),
            transformResponse: (response: { data: { muelles: any } }) => response?.data?.muelles
        }),
        deletePatentMovement: builder.mutation({
            query: ({ patentId, stayId }) => ({
                url: `patentes/${patentId}/estadias/${stayId}`,
                method: 'DELETE'
            })
        }),
        editPatentMovement: builder.mutation({
            query: ({ patentId, stayId, body }: any) => ({
                url: `patentes/${patentId}/estadias/${stayId}`,
                method: 'PATCH',
                body: body
            })
        }),
        patentBillingRecord: builder.mutation({
            query: ({ patentId, formData }) => ({
                url: `patentes/${patentId}/facturacion`,
                method: 'POST',
                body: formData
            })
        }),
        downloadAttachedFile: builder.query({
            query: ({ patentId, billingNumber }) => ({
                url: `patentes/${patentId}/facturacion/${billingNumber}`
            }),
            transformResponse: (response: { data: { presignedUrl: string } }) =>
                response?.data?.presignedUrl
        }),
        getRateCodes: builder.query({
            query: () => ({
                url: 'patentes/codigos-tarifa'
            }),
            transformResponse: (response: { data: { codigos: any } }) => response?.data?.codigos
        }),
        liquidatePatent: builder.mutation({
            query: (patentId) => ({
                url: `patentes/${patentId}/liquidacion`,
                method: 'POST'
            })
        }),
        downloadLiquidationPDF: builder.query({
            query: (patentId) => ({
                url: `patentes/${patentId}/pasavante/pdf`
            }),
            transformResponse: (response: { data: { pdf: any } }) => response?.data?.pdf
        })
    })
});

export const {
    useLazyDownloadLiquidationPDFQuery,
    useLiquidatePatentMutation,
    useGetRateCodesQuery,
    useLazyDownloadAttachedFileQuery,
    usePatentBillingRecordMutation,
    useEditPatentMovementMutation,
    useDeletePatentMovementMutation,
    useGetDockingByPatentIdQuery,
    useGetPatentOperationsQuery,
    useAddOperationMutation,
    useUnsubscribePatentMutation,
    useLazyGetConversationQuery,
    usePostPatentAnswerMutation,
    useGetAnswersQuery,
    useGetPatentQuery,
    useLazyGetPatentQuery,
    useGetPatentsQuery,
    useLazyDownloadPatentPDFQuery,
    useValidatePatentsMutation,
    useAddPatentMutation
} = patentsApi;
