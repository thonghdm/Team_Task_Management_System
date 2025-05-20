import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messageApi from '~/apis/chat/messageApi.js';

export const fetchConversationList = createAsyncThunk(
  'conversation/fetchConversationList',
  async (accessToken, thunkAPI) => {
    try {
      const data = await messageApi.getConversationList(accessToken);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getConversation = createAsyncThunk(
  'conversation/getConversation',
  async ({ accessToken, userId, otherUserId }, thunkAPI) => {
    try {
      const data = await messageApi.getConversation(accessToken, userId, otherUserId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createConversation = createAsyncThunk(
  'conversation/createConversation',
  async ({ accessToken, userId, otherUserId }, thunkAPI) => {
    try {
      const data = await messageApi.createConversation(accessToken, userId, otherUserId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'conversation/fetchMessages',
  async ({ accessToken, conversationId }, thunkAPI) => {
    try {
      const data = await messageApi.getMessages(accessToken, conversationId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const conversationSlice = createSlice({
  name: 'conversation',
  initialState: {
    conversations: [],
    currentConversation: null,
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetConversation: (state) => {
      state.conversations = [];
      state.currentConversation = null;
      state.messages = [];
      state.loading = false;
      state.error = null;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversationList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationList.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversationList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload;
      })
      .addCase(getConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload;
        if (action.payload && !state.conversations.find(c => c._id === action.payload._id)) {
          state.conversations = [action.payload, ...state.conversations];
        }
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetConversation, setCurrentConversation } = conversationSlice.actions;
export default conversationSlice.reducer; 