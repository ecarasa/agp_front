import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { logout, tokenReceived } from '../features/auth/authSlice';
import { RootState } from '../redux/store';
import { settings } from '../settings';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface tableResponse {
    data: {
        totalCount: 6;
        skip: 0;
        take: 10;
        count: 6;
        data: [
            {
                id: number;
                nombre: string;
                usuario: string;
                mail: string;
                telefono: string;
                activo: boolean;
                confirmado: boolean;
                fechaConfirmacion: Date | null;
                bloqueado: boolean;
                empresa: {
                    id: number;
                    nombre: string;
                };
                roles: [
                    {
                        id: number;
                        nombre: string;
                    }
                ];
            }
        ];
    };
}

export interface BodyUser {
    usuario: string;
    activo: true;
    bloqueado: true;
    idEmpresa: number;
    idsRol: [];
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

export const usersApi = createApi({
    reducerPath: 'users',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: (body) => ({
                url: '/users',
                params: body
            }),
            providesTags: ['Users']
        }),
        editUser: builder.mutation({
            query: (body) => ({
                url: `/users`,
                method: 'PATCH',
                body: body
            }),
            invalidatesTags: (_, error) => (error ? [] : ['Users'])
        }),
        getUserData: builder.query<any, void>({
            query: () => ({
                url: 'users/me'
            })
        }),
        submitTokenFcm: builder.mutation({
            query: (body) => ({
                url: `users/token-fcm`,
                body: body,
                method: 'PATCH'
            })
        }),
        getUserPorts: builder.query({
            query: () => ({
                url: 'users/puertos'
            }),
            transformResponse: (response: { data: { organizaciones: any } }) =>
                response?.data?.organizaciones
        }),
        changeUserPort: builder.mutation({
            query: (body) => ({
                url: 'users/me/puertos',
                body: body,
                method: 'PATCH'
            })
        })
    })
});

export const {
    useChangeUserPortMutation,
    useGetUserPortsQuery,
    useSubmitTokenFcmMutation,
    useGetUsersQuery,
    useEditUserMutation,
    useLazyGetUserDataQuery
} = usersApi;
