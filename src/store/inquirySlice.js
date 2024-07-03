import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isInquiryOpen: false,
};

const inquirySlice = createSlice({
  name: 'inquiry',
  initialState,
  reducers: {
    toggleInquiryOpen: (state) => {
      state.isInquiryOpen = !state.isInquiryOpen;
    },
  },
});

export const { toggleInquiryOpen } = inquirySlice.actions;
export default inquirySlice.reducer;
