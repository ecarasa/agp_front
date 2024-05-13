import React from 'react';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { StyledEngineProvider } from '@mui/material';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import i18next from './config/i18next-config';
import { I18nextProvider } from 'react-i18next';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const container = document.getElementById('root')!;
const root = createRoot(container);

if (process.env.NODE_ENV === 'development') {
    const { worker } = require('./browser');
    // worker.start();
}

root.render(
    <React.StrictMode>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18next}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <StyledEngineProvider injectFirst>
                            <BrowserRouter>
                                <SnackbarProvider
                                    preventDuplicate
                                    maxSnack={3}
                                    autoHideDuration={6000}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left'
                                    }}
                                    style={{ pointerEvents: 'all' }}
                                >
                                    <App />
                                </SnackbarProvider>
                            </BrowserRouter>
                        </StyledEngineProvider>
                    </PersistGate>
                </Provider>
            </I18nextProvider>
        </LocalizationProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
