import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';
import { User } from './authApi';

type AuthState = {
    user: User | null;
    accessToken: string | null;
    tokenFcm: string | null;
};

const initialState = { user: null, accessToken: null, tokenFcm: null } as AuthState;

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        tokenReceived: (state, { payload }) => {
            state.accessToken = payload.accessToken;
        },
        logout: () => initialState,
        setUserData: (state, { payload }) => {
            state.user = payload;
        },
        setTokenFcm: (state, { payload }) => {
            state.tokenFcm = payload.tokenFcm;
        }
    }
});

export default authSlice.reducer;

export const { logout, tokenReceived, setUserData, setTokenFcm } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
