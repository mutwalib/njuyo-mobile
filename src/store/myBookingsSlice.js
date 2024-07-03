// src/features/bookings/bookingsSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  getMyBookings,
  receiveBooking,
  scheduleAppointment,
  cancelAppointment,
  ownerConfirmInspection,
  addTakenRental,
} from '../services/RentalService';
// Async thunk for fetching bookings
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async userId => {
    const response = await getMyBookings(userId);
    return response.data.sort(
      (a, b) => new Date(b.bookedOn) - new Date(a.bookedOn),
    );
  },
);

export const handleReceiveBookingAction = createAsyncThunk(
  'bookings/receiveBooking',
  async bookId => {
    const response = await receiveBooking(bookId);
    if (response.status === 202) {
      return {bookId, status: 'RECEIVED'};
    }
    throw new Error('Failed to receive booking');
  },
);

export const handleScheduleAppointmentAction = createAsyncThunk(
  'bookings/scheduleAppointment',
  async appointmentDetails => {
    const response = await scheduleAppointment(appointmentDetails);
    if (response.status === 202) {
      return {...appointmentDetails, status: 'SCHEDULED'};
    }
    throw new Error('Failed to schedule appointment');
  },
);

export const handleCancelAppointmentAction = createAsyncThunk(
  'bookings/cancelAppointment',
  async scheduleId => {
    await cancelAppointment(scheduleId);
    return scheduleId;
  },
);

export const handleApproveInspectionAction = createAsyncThunk(
  'bookings/approveInspection',
  async bookId => {
    const response = await ownerConfirmInspection(bookId);
    if (response.status === 200) {
      return {bookId, status: 'INSPECTED'};
    }
    throw new Error('Failed to approve inspection');
  },
);

export const handleRentOutPropertyAction = createAsyncThunk(
  'bookings/rentOutProperty',
  async ({customerId, rentalId}) => {
    const response = await addTakenRental({customerId, rentalId});
    if (response.status === 200) {
      return {rentalId, status: 'RENTED'};
    }
    throw new Error('Failed to rent out property');
  },
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBookings.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(handleReceiveBookingAction.fulfilled, (state, action) => {
        state.bookings = state.bookings.map(booking =>
          booking.id === action.payload.bookId
            ? {...booking, status: action.payload.status}
            : booking,
        );
      })
      .addCase(handleScheduleAppointmentAction.fulfilled, (state, action) => {
        state.bookings = state.bookings.map(booking =>
          booking.id === action.payload.bookId
            ? {...booking, status: action.payload.status, ...action.payload}
            : booking,
        );
      })
      .addCase(handleCancelAppointmentAction.fulfilled, (state, action) => {
        state.bookings = state.bookings.map(booking =>
          booking.id === action.payload
            ? {...booking, status: 'CANCELLED'}
            : booking,
        );
      })
      .addCase(handleApproveInspectionAction.fulfilled, (state, action) => {
        state.bookings = state.bookings.map(booking =>
          booking.id === action.payload.bookId
            ? {...booking, status: action.payload.status}
            : booking,
        );
      })
      .addCase(handleRentOutPropertyAction.fulfilled, (state, action) => {
        state.bookings = state.bookings.map(booking =>
          booking.id === action.payload.rentalId
            ? {...booking, status: action.payload.status}
            : booking,
        );
      });
  },
});

export default bookingsSlice.reducer;
