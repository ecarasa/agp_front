import { Body } from '../pages/Usuarios/UsersSave/hooks/useUserSave';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { logout, tokenReceived } from '../features/auth/authSlice';
import { RootState } from '../redux/store';
import { settings } from '../settings';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface CompanyRolesResponse {
    data: {
        empresas: [
            {
                id: number;
                nombre: string;
            }
        ];
        roles: [
            {
                id: number;
                nombre: string;
            }
        ];
    };
}

interface createTaskBody {
    text: string;
}
interface ReenvioMail {
    usuario: string;
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

export const createUsuarios = createApi({
    reducerPath: 'CreateUser',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getCompanyRoles: builder.query<CompanyRolesResponse, void>({
            query: () => ({
                url: `/auth/datos-parametricos`,
                method: 'GET'
            })
        }),
        createUser: builder.mutation<createTaskBody, Body>({
            query: (body) => ({
                url: `/auth/sign-up`,
                method: 'POST',
                body: body
            })
        }),
        reenviarMail: builder.mutation({
            query: (body) => ({
                url: `/auth/resend-password`,
                method: 'POST',
                body: body
            })
        })
    })
});

export const { useGetCompanyRolesQuery, useCreateUserMutation, useReenviarMailMutation } =
    createUsuarios;
