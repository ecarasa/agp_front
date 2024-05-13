import { authApi } from '../features/auth/authApi';
import { companyApi } from '../services/companyApi';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';
import { createUsuarios } from '../services/CreateUser';
import { girosApi } from '../services/girosApi';
import { newsApi, newsGestorApi } from '../services/newsApi';
import { notificationsApi } from '../services/notificationsApi';
import { patentsApi } from '../services/patentsApi';
import { persistStore, persistReducer, PERSIST, PURGE, REHYDRATE } from 'redux-persist';
import { railwaysApi } from '../services/railwaysApi';
import { shipsApi } from '../services/shipsApi';
import { shipServiceApi } from '../services/shipServiceApi';
import { usersApi } from '../services/usersApi';
import applicationSlice from '../features/slices/applicationSlice';
import authReducer from '../features/auth/authSlice';
import storage from 'redux-persist/lib/storage';
import themeSlice from '../features/slices/themeSlice';
import { rolesApi } from '../services/rolesApi';

const persistedAuthReducer = persistReducer({ key: 'root', storage }, authReducer);

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [createUsuarios.reducerPath]: createUsuarios.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        ships: shipsApi.reducer,
        empresa: companyApi.reducer,
        auth: persistedAuthReducer,
        theme: themeSlice,
        application: applicationSlice,
        giros: girosApi.reducer,
        [notificationsApi.reducerPath]: notificationsApi.reducer,
        [newsApi.reducerPath]: newsApi.reducer,
        [newsGestorApi.reducerPath]: newsGestorApi.reducer,
        [patentsApi.reducerPath]: patentsApi.reducer,
        [railwaysApi.reducerPath]: railwaysApi.reducer,
        serviciosNave: shipServiceApi.reducer,
        roles: rolesApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
            .concat(authApi.middleware)
            .concat(createUsuarios.middleware)
            .concat(usersApi.middleware)
            .concat(companyApi.middleware)
            .concat(shipsApi.middleware)
            .concat(girosApi.middleware)
            .concat(notificationsApi.middleware)
            .concat(newsApi.middleware)
            .concat(newsGestorApi.middleware)
            .concat(patentsApi.middleware)
            .concat(railwaysApi.middleware)
            .concat(shipServiceApi.middleware)
            .concat(rolesApi.middleware)
            .concat(
                createStateSyncMiddleware({
                    blacklist: [PURGE, PERSIST, REHYDRATE],
                    broadcastChannelOption: { type: 'localstorage' }
                })
            )
});

initMessageListener(store);
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
