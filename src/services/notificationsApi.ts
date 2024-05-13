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

export const notificationsApi = createApi({
    reducerPath: 'notifications',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['notifications'],
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: ({ filters }) => ({
                url: 'comunicaciones',
                params: filters
            }),
            providesTags: ['notifications']
        }),
        setRead: builder.mutation({
            query: (id) => ({
                url: `comunicaciones/${id}/leida`,
                method: 'PUT'
            }),
            invalidatesTags: (_, error) => (error ? [] : ['notifications'])
        })
    })
});

export const { useGetNotificationsQuery, useSetReadMutation } = notificationsApi;
