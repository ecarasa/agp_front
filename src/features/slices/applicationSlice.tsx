import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';

const initialState = { alert: {}, loading: false, communicationData: {}, publicContent: {} };

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        showAlert: (state, { payload }) => {
            state.alert = payload;
        },
        hideAlert: () => initialState,
        setStorageLoading: (state, { payload }) => {
            state.loading = payload;
        },
        setCommunicationData: (state, { payload }) => {
            state.communicationData = payload;
        },
        setPublicContentData: (state, { payload }) => {
            state.publicContent = payload;
        }
    }
});

export default applicationSlice.reducer;

export const {
    showAlert,
    hideAlert,
    setStorageLoading,
    setCommunicationData,
    setPublicContentData
} = applicationSlice.actions;

export const selectCurrentContent = (state: RootState) => state.application.publicContent;
export const selectCurrentCommunication = (state: RootState) => state.application.communicationData;
