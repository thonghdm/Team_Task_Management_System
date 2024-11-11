import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFileByIdTask, updateFileByIdTask, updateAttachmentByIdFile } from '~/apis/Project/uploadFileService';

// Create async thunk with the function already defined in the service
export const fetchFileByIdTask = createAsyncThunk(
  'file/fetchByIdTask',
  async ({ accesstoken, taskId }, thunkAPI) => {
    try {
      // Call the defined API function
      const data = await getFileByIdTask(accesstoken, taskId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateFileByIdTaskThunk = createAsyncThunk(
  'file/updateByIdTask',
  async ({ accesstoken, file }, thunkAPI) => {
    try {
      // Call the defined API function
      const data = await updateFileByIdTask(accesstoken, file);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAttachmentByIdFileThunk = createAsyncThunk(
  'file/updateAttachmentByIdFile',
  async ({ accesstoken, attachmentId, updateData }, thunkAPI) => {
    try {
      // Call the defined API function
      const data = await updateAttachmentByIdFile(accesstoken, attachmentId, updateData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create slice for Redux Toolkit
const fileSlice = createSlice({
  name: 'file',
  initialState: {
    files: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFileByIdTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFileByIdTask.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchFileByIdTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(updateFileByIdTaskThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFileByIdTaskThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(updateFileByIdTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateAttachmentByIdFileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttachmentByIdFileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(updateAttachmentByIdFileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default fileSlice.reducer;
