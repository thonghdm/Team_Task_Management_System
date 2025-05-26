import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadChatFile, getChatFilesByConversationId } from '~/apis/chat/chatFileService';

// Upload chat file
export const uploadChatFileThunk = createAsyncThunk(
  'chatFile/upload',
  async ({ accessToken, fileData }, thunkAPI) => {
    try {
      const data = await uploadChatFile(accessToken, fileData);
      console.log('accessTokennnnnn:', data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get files by conversation ID
export const fetchChatFilesByConversationId = createAsyncThunk(
  'chatFile/fetchByConversationId',
  async ({ accessToken, conversationId }, thunkAPI) => {   
    try {
      console.log("accessTokennnnnnnnnnnnnnnnnnnnnnnn", accessToken);
      const dataPromise = await getChatFilesByConversationId(accessToken, conversationId);
      console.log("dataPromise", dataPromise);
      return dataPromise;
    } catch (error) {
      console.error('Error fetching chat files:', error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const chatFileSlice = createSlice({
  name: 'chatFile',
  initialState: {
    files: [],
    loading: false,
    error: null,
    uploadingFile: false,
  },
  reducers: {
    clearFiles: (state) => {
      state.files = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Upload file
      .addCase(uploadChatFileThunk.pending, (state) => {
        state.uploadingFile = true;
        state.error = null;
      })
      .addCase(uploadChatFileThunk.fulfilled, (state, action) => {
        state.uploadingFile = false;
        // File upload thành công sẽ được handle bằng socket để real-time
      })
      .addCase(uploadChatFileThunk.rejected, (state, action) => {
        state.uploadingFile = false;
        state.error = action.payload;
      })
      
      // Fetch files
      .addCase(fetchChatFilesByConversationId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatFilesByConversationId.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchChatFilesByConversationId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('Files fetch rejected:', action.payload);
      });
  }
});

export const { clearFiles } = chatFileSlice.actions;
export default chatFileSlice.reducer; 