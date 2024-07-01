import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import nearestRentalReducer from './nearestRentalSlice';
import pagedRentalsReducer from './pagedRentalsSlice';
import myRentalsReducer from './myRentalsSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    nearestRentals: nearestRentalReducer,
    rentals: pagedRentalsReducer,
    myRentals: myRentalsReducer,
  },
});

export default store;
