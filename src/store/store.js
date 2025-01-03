import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice';

const preloadedState = JSON.parse(localStorage.getItem('authState')) || {
  auth: {
    userData: null,
    status: 'idle',
  },
};

const store = configureStore({
  reducer: {
    auth : authSlice,
  },
  preloadedState,
})

store.subscribe(() => {
    localStorage.setItem('authState', JSON.stringify(store.getState()));
  });

export default store;