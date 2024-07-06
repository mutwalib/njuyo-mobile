import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import nearestRentalReducer from './nearestRentalSlice';
import pagedRentalsReducer from './pagedRentalsSlice';
import myRentalsReducer from './myRentalsSlice';
import inquiryReducer from './inquirySlice';
import myBookingsReducer from './myBookingsSlice';
import bookingsOnRentalReducer from './bookingsOnRentalSlice';
import roleApplicationStatusReducer from './roleApplicationStatusSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    nearestRentals: nearestRentalReducer,
    rentals: pagedRentalsReducer,
    myRentals: myRentalsReducer,
    inquiry: inquiryReducer,
    bookings: myBookingsReducer,
    bookingOnRental: bookingsOnRentalReducer,
    applicationStatus: roleApplicationStatusReducer,
  },
});

export default store;
