import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllByOwnerId, getProjectDetal } from '~/apis/Project/projectService';

// Tạo async thunk với hàm đã có
export const fetchProjectsByOwnerId = createAsyncThunk(
  'projects/fetchByOwnerId',
  async ({ accesstoken, ownerId }, thunkAPI) => {
    try {
      // Gọi lại hàm API đã định nghĩa
      const data = await getAllByOwnerId(accesstoken, ownerId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


// Tạo slice cho Redux Toolkit
const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectsByOwnerId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectsByOwnerId.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjectsByOwnerId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default projectsSlice.reducer;