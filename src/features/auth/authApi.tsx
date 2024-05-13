import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { handleErrors } from '../../utils/common';
import { logout, setUserData, tokenReceived } from './authSlice';
import { RootState } from '../../redux/store';
import { settings } from '../../settings';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

export interface User {
    activo: boolean;
    bloqueado: boolean;
    confirmado: boolean;
    email: string;
    empresa: {
        id: number;
        nombre: string;
        perfiles: [
            {
                id: number;
                nombre: string;
            }
        ];
        tienePerfilAgenciaMaritima: boolean;
    };
    funcionalidadesAgrupadas: [
        {
            funcionalidades: [
                {
                    id: number;
                    nombre: string;
                }
            ];
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
    telefono: string;
    usuario: string;
}

interface LoginResponse {
    accessToken: string;
}

interface LoginRequest {
    usuario: string;
    password: string;
}

interface ConfirmRequest {
    usuario: string;
    passwordTemporal: string;
    newPassword: string;
}

interface RecoveryRequest {
    usuario: string;
    email: string;
}

interface ConfirmRecovery {
    usuario: string;
    confirmationCode: string;
    newPassword: string;
}

const baseQuery = fetchBaseQuery({
    baseUrl: `${settings.url.host}${settings.url.api}`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const accessToken = (getState() as RootState).auth.accessToken;
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }
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

    if (result?.data?.data?.accessToken) {
        const token = result.data.data.accessToken;

        localStorage.setItem('accessToken', token);
        sessionStorage.setItem('accessToken', token);
        api.dispatch(tokenReceived(result?.data?.data));

        const response: any = await baseQuery(
            { url: '/users/me', credentials: 'include' },
            api,
            extraOptions
        );
        if (!response?.error) api.dispatch(setUserData(response?.data?.data));
        else handleErrors(response.error);
    }

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

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, any>({
            query: (formData: any) => ({
                url: `auth/sign-in`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            })
        }),
        logout: builder.mutation<any, any>({
            query: (body) => ({
                url: '/auth/sign-out',
                method: 'POST',
                body: body
            })
        }),
        confirmUser: builder.mutation<any, ConfirmRequest>({
            query: (credencials) => ({
                url: 'auth/confirm-registered-user',
                method: 'POST',
                body: credencials
            })
        }),
        forgotPassword: builder.mutation<any, RecoveryRequest>({
            query: (credencials) => ({
                url: 'auth/forgot-password',
                method: 'POST',
                body: credencials
            })
        }),
        confirmForgotPassword: builder.mutation<any, ConfirmRecovery>({
            query: (credencials) => ({
                url: 'auth/confirm-forgot-password',
                method: 'POST',
                body: credencials
            })
        }),
        changePassword: builder.mutation({
            query: ({ body }) => ({
                url: 'auth/change-password',
                method: 'POST',
                body: body
            })
        })
    })
});

export const {
    useChangePasswordMutation,
    useLoginMutation,
    useLogoutMutation,
    useConfirmUserMutation,
    useForgotPasswordMutation,
    useConfirmForgotPasswordMutation
} = authApi;
