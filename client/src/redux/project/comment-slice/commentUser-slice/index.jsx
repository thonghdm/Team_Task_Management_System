import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCommentById } from '~/apis/Project/commentService';

// Create async thunk with the function already defined
export const fetchCommentById = createAsyncThunk(
  'comment/fetchById',
  async ({ accesstoken, taskId }, thunkAPI) => {
    try {
      // Call the defined API function
      const data = await getCommentById(accesstoken, taskId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create slice for Redux Toolkit
const commentUserSlice = createSlice({
  name: 'commentUser',
  initialState: {
    commentUser: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentById.fulfilled, (state, action) => {
        state.loading = false;
        state.commentUser = action.payload;
      })
      .addCase(fetchCommentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    },
});

export default commentUserSlice.reducer;