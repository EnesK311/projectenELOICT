import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from '../features/auth/authSlice'; // Adjust path if needed
import { api } from '../api/apiSlice'; // Adjust path if needed

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // If you want to store the entire RTK Query cache as well,
// you must whitelist the RTK Query reducer path:
  whitelist: ['auth', api.reducerPath],
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
});

// Wrap the rootReducer with persistReducer for persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
