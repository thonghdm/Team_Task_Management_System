import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProjectDetal } from '~/apis/Project/projectService';
import { updateProject } from '~/apis/Project/projectService';


// Create async thunk for fetching project detail
export const fetchProjectDetail = createAsyncThunk(
  'project/fetchDetail',
  async ({ accesstoken, projectId }, thunkAPI) => {
    try {
      const data = await getProjectDetal(accesstoken, projectId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create async thunk for updating project
export const updateProjectDetailThunk = createAsyncThunk(
  'project/update',
  async ({ accesstoken, projectId, projectData }, thunkAPI) => {
    try {
      const data = await updateProject(accesstoken, projectId, projectData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create slice for project detail
const projectDetailSlice = createSlice({
  name: 'projectDetail',
  initialState: {
    projectData: null,
    loading: false,
    error: null
  },
  reducers: {
    // Reset project detail state
    resetProjectDetail: (state) => {
      state.projectData = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.projectData = action.payload;
      })
      .addCase(fetchProjectDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProjectDetailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProjectDetailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.projectData = action.payload;
      })
      .addCase(updateProjectDetailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { resetProjectDetail } = projectDetailSlice.actions;

// Export reducer
export default projectDetailSlice.reducer;