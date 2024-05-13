import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';

/* interface DarkTheme {
    type: string
}

const initialState: DarkTheme={
    type: 'light',
} */

export const themeSlice = createSlice({
    name: 'theme',
    initialState: 'light',
    reducers: {
        changeTheme: (state, action: PayloadAction<string>) => action.payload
    }
});

export const { changeTheme } = themeSlice.actions;
export const selectTheme = (state: RootState) => state.theme;
export default themeSlice.reducer;
