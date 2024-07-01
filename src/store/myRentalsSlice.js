import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getMyRentals} from '../services/RentalService';

export const fetchMyRentals = createAsyncThunk(
  'rentals/fetchMyRentals',
  async userId => {
    const response = await getMyRentals(userId);
    return response.data;
  },
);

const myRentalsSlice = createSlice({
  name: 'myRentals',
  initialState: {
    myRentals: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMyRentals.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchMyRentals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.myRentals = action.payload;
      })
      .addCase(fetchMyRentals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default myRentalsSlice.reducer;
