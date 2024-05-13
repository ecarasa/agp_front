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

export const rolesApi = createApi({
    reducerPath: 'roles',
    tagTypes: ['Roles'],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getRoles: builder.query({
            query: (params) => ({
                url: '/roles',
                params
            }),
            providesTags: ['Roles']
        }),
        createRole: builder.mutation({
            query: ({ body }) => ({
                url: `/roles`,
                method: 'POST',
                body
            })
        }),
        getRoleById: builder.query({
            query: (idRol) => ({ url: `roles/${idRol}` }),
            transformResponse: (response: { data: any }) => response?.data
        }),
        editRoleById: builder.mutation({
            query: ({ body, idRol }) => ({
                url: `/roles/${idRol}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: (_, error) => (error ? [] : ['Roles'])
        }),
        getRolesPerfiles: builder.query({
            query: (params) => ({
                url: '/roles/perfiles',
                params
            }),
            providesTags: ['Roles']
        }),
        getRolesFucionalidades: builder.query({
            query: (params) => ({
                url: '/roles/funcionalidades',
                params
            }),
            providesTags: ['Roles']
        })
    })
});

export const {
    useCreateRoleMutation,
    useGetRolesQuery,
    useLazyGetRolesQuery,
    useLazyGetRoleByIdQuery,
    useEditRoleByIdMutation,
    useGetRolesPerfilesQuery,
    useGetRolesFucionalidadesQuery
} = rolesApi;
