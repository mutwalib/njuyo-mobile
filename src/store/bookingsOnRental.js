import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBookingsOnRental } from '../services/RentalService';
export const fetchBookingsOnRental = createAsyncThunk(
  'bookings/fetchBookingsOnRental',
  async (rentalId) => {
    const response = await getBookingsOnRental(rentalId);
    return { rentalId, bookings: response.data };
  }
);

const bookingsSlice = createSlice({
  name: 'bookingsOnRental',
  initialState: {
    rentalBookings: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingsOnRental.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookingsOnRental.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rentalBookings[action.payload.rentalId] = action.payload.bookings;
      })
      .addCase(fetchBookingsOnRental.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default bookingsSlice.reducer;
