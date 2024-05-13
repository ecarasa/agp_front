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

export const newsApi = createApi({
    reducerPath: 'news',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['news'],
    endpoints: (builder) => ({
        getNews: builder.query({
            query: ({ filters }) => ({
                url: 'contenido/home/privado/noticias',
                params: filters
            }),
            providesTags: ['news']
        }),
        getPublicNews: builder.query({
            query: ({ filters }) => ({
                url: 'contenido/home/publico/noticias',
                params: filters
            }),
            providesTags: ['news']
        }),
        getPublicContent: builder.query({
            query: () => ({ url: 'contenido/home/publico' }),
            providesTags: ['news']
        }),
        getContentDisposiciones: builder.query({
            query: () => ({ url: 'contenido/disposiciones' }),
            providesTags: ['news']
        })
        // setRead: builder.mutation({
        //     query: (id) => ({
        //         url: `comunicaciones/${id}/leida`,
        //         method: 'PUT'
        //     }),
        //     invalidatesTags: (_, error) => (error ? [] : ['news'])
        // })
    })
});

export const newsGestorApi = createApi({
    reducerPath: 'gestor',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['gestor'],
    endpoints: (builder) => ({
        getGestorContenido: builder.query({
            query: ({ filters }) => ({
                url: '/gestor-contenido/paginas',
                params: filters
            }),
            providesTags: ['gestor']
        }),
        getGestorContenidoByIdPagina: builder.query({
            query: ({ idPagina }) => ({ url: `/gestor-contenido/paginas/${idPagina}` }),
            transformResponse: (response: { data: any }) => response?.data
        }),
        createContenido: builder.mutation({
            query: ({ body, idSeccion }) => ({
                url: `/gestor-contenido/paginas/seccion/${idSeccion}/contenido`,
                method: 'POST',
                body: body
            }),
            //invalidatesTags: (_) => ['gestor']
        }),
        editContenido: builder.mutation({
            query: ({ body, idContenido }) => ({
                url: `/gestor-contenido/paginas/seccion/contenido/${idContenido}`,
                method: 'PATCH',
                body
            }),
            //invalidatesTags: (_, error) => (error ? [] : ['gestor'])
        }),
        deleteContenido: builder.mutation({
            query: ({ idContenido }) => ({
                url: `/gestor-contenido/paginas/seccion/contenido/${idContenido}`,
                method: 'DELETE'
            })
        }),
        publishContenido: builder.mutation({
            query: ({ idSeccion }) => ({
                url: `/gestor-contenido/publicar/${idSeccion}`,
                method: 'POST',
            })
        }),
    })
});

export const {
    useGetGestorContenidoQuery,
    useLazyGetGestorContenidoByIdPaginaQuery,
    useCreateContenidoMutation,
    useEditContenidoMutation,
    useDeleteContenidoMutation,
    usePublishContenidoMutation,
} = newsGestorApi;

export const {
    useGetNewsQuery,
    useGetPublicNewsQuery,
    useGetPublicContentQuery,
    useGetContentDisposicionesQuery
} = newsApi;
