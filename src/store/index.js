import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import nearestRentalReducer from './nearestRentalSlice';
import pagedRentalsReducer from './pagedRentalsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    nearestRentals: nearestRentalReducer,
    rentals: pagedRentalsReducer
  },
});

export default store;
