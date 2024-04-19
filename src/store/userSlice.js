import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {whoAmI} from '../services/AuthServices';
// Define the initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
};
export const fetchUserAsync = createAsyncThunk('user/fetchUser', async () => {
  const response = await whoAmI();
  return response.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUser: state => {
      state.user = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUserAsync.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

// export const selectUser = state => state.user.user;
export const {setUser, setLoading, setError, clearUser} = userSlice.actions;
export default userSlice.reducer;
