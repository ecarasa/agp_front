import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { logout, tokenReceived } from '../features/auth/authSlice';
import { RootState } from '../redux/store';
import { settings } from '../settings';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface CompanyRolesResponse {
    perfiles: [
        {
            id: number;
            nombre: string;
        }
    ];
    categoriasFiscales: [
        {
            id: number;
            nombre: string;
        }
    ];
    organizaciones: [
        {
            id: number;
            abreviatura: string;
            colorPrincipal: string;
            imagenes: string;
            nombre: string;
        }
    ];
}

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

export const companyApi = createApi({
    reducerPath: 'empresa',
    tagTypes: ['Empresas', 'EmpresaById'],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        createEmpresa: builder.mutation({
            query: (body) => ({
                url: `/empresas`,
                method: 'POST',
                body: body
            })
        }),
        editEmpresa: builder.mutation({
            query: ({ body, idEmpresa }) => ({
                url: `/empresas/${idEmpresa}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: (_, error) => (error ? [] : ['Empresas', 'EmpresaById'])
        }),
        editEmpresaState: builder.mutation({
            query: ({ body, idEmpresa }) => ({
                url: `/empresas/${idEmpresa}/estado`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: (_, error) => (error ? [] : ['Empresas', 'EmpresaById'])
        }),
        getParametricData: builder.query<CompanyRolesResponse, void>({
            query: () => ({ url: 'empresas/datos-parametricos' }),
            keepUnusedDataFor: 60 * 60 * 12,
            transformResponse: (response: { data: any }) => response?.data
        }),
        getEmpresas: builder.query({
            query: (params) => ({
                url: '/empresas',
                params
            }),
            providesTags: ['Empresas']
        }),
        getCertificatesByIdBuque: builder.query({
            query: (idBuque) => ({ url: `buques/${idBuque}/certificados` }),
            transformResponse: (response: { data: any }) => response?.data
        }),
        getEmpresa: builder.query({
            query: (idEmpresa) => ({ url: `empresas/${idEmpresa}` }),
            providesTags: ['EmpresaById'],
            transformResponse: (response: { data: any }) => response?.data
        }),
        getComunicaciones: builder.query({
            query: () => ({ url: '/empresas/comunicaciones/certificados' }),
            providesTags: ['Empresas']
        }),
        editComunicacionCertificado: builder.mutation({
            query: ({ body, idCertificado }) => ({
                url: `/empresas/comunicaciones/certificados/${idCertificado}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: (_, error) => (error ? [] : ['Empresas'])
        }),
        getComunicacionesEventos: builder.query({
            query: () => ({ url: '/empresas/comunicaciones/eventos' }),
            providesTags: ['Empresas']
        }),
        editComunicacionEventos: builder.mutation({
            query: ({ body, id }) => ({
                url: `/empresas/comunicaciones/eventos/${id}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: (_, error) => (error ? [] : ['Empresas'])
        }),
        editComunicacionEventosUsers: builder.mutation({
            query: ({ body, id }) => ({
                url: `/empresas/comunicaciones/eventos/${id}/usuarios`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: (_, error) => (error ? [] : ['Empresas'])
        }),
        editComunicacionEventosPerfil: builder.mutation({
            query: ({ body, idParametroEventoPerfil }) => ({
                url: `/empresas/comunicaciones/eventos/perfil/${idParametroEventoPerfil}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: (_, error) => (error ? [] : ['Empresas'])
        })
    })
});

export const {
    useGetEmpresaQuery,
    useCreateEmpresaMutation,
    useLazyGetParametricDataQuery,
    useGetParametricDataQuery,
    useEditEmpresaMutation,
    useEditEmpresaStateMutation,
    useGetEmpresasQuery,
    useLazyGetEmpresaQuery,
    useGetComunicacionesQuery,
    useEditComunicacionCertificadoMutation,
    useGetComunicacionesEventosQuery,
    useEditComunicacionEventosMutation,
    useEditComunicacionEventosUsersMutation,
    useEditComunicacionEventosPerfilMutation
} = companyApi;
