import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';

const initialState = { user: null, accessToken: null };

const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        tokenReceived: (state, { payload }) => {
            state.accessToken = payload.accessToken;
        },
        logout: () => initialState,
        setUserData: (state, { payload }) => {
            state.user = payload;
        }
    }
});

export default userSlice.reducer;

export const { logout, tokenReceived, setUserData } = userSlice.actions;

// export const selectCurrentUser = (state: RootState) => state.auth.user;
