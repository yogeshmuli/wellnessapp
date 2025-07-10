import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/auth';

let Store = configureStore({
  reducer: {
    authReducer,
  },
});

export default Store;
