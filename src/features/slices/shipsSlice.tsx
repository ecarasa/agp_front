import { createSlice } from '@reduxjs/toolkit';

const initialState = { datosParametricos: {} };

const shipSlice = createSlice({
    name: 'ships',
    initialState,
    reducers: {
        setParametricData: (state, { payload }) => (state.datosParametricos = payload)
    }
});

export default shipSlice.reducer;

export const { setParametricData } = shipSlice.actions;
