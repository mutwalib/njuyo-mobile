import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosClient from '../services/api/api';

export const getRentalsNearYou = createAsyncThunk(
  'nearestRentals/getRentalsNearYou',
  async (location, thunkAPI) => {
    try {
      const [latitude, longitude] = location.split(',').map(Number);
      const page = 0;
      const size = 10;
      const response = await axiosClient.get(
        `/property/rental/nearest?latitude=${latitude}&longitude=${longitude}&page=${page}&size=${size}`,
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

const nearestRentalSlice = createSlice({
  name: 'nearestRentals',
  initialState: {
    nearestRentals: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getRentalsNearYou.pending, state => {
        state.loading = true;
      })
      .addCase(getRentalsNearYou.fulfilled, (state, action) => {
        state.loading = false;
        state.nearestRentals = action.payload.content;
      })
      .addCase(getRentalsNearYou.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default nearestRentalSlice.reducer;
