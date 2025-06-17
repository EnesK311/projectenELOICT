import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import persistedReducer from './rootReducer';
import { api } from '../api/apiSlice';

// Create the store using the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for FormData, etc.
    }).concat(api.middleware),
});

// Create the persistor (to actually persist the store)
export const persistor = persistStore(store);

// Types for convenience
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
