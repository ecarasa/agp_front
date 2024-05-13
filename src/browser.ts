import { setupWorker } from 'msw'
import { authHandlers } from './features/auth/mocks/authHandlers'

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...authHandlers)