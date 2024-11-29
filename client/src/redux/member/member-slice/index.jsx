// allMemberSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllMembers } from '~/apis/User/userService';

// Async thunk for fetching all members
export const fetchAllMembers = createAsyncThunk(
  'member/fetchAllMembers',
  async ({ accesstoken }, thunkAPI) => {
    try {
      const data = await getAllMembers(accesstoken);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Member slice
const memberSlice = createSlice({
  name: 'allMember',
  initialState: {
    memberData: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetAllMember: (state) => {
      state.memberData = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.memberData = action.payload;
      })
      .addCase(fetchAllMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetAllMember } = memberSlice.actions;
export default memberSlice.reducer;
