import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getNotifications, createNotification, markAsReadNotification } from '~/apis/Project/notificationApi';

export const fetchNotifications = createAsyncThunk(
    'notifications/fetch',
    async ({ accesstoken, userId }, thunkAPI) => {
        try {
            const response = await getNotifications(accesstoken, userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addNotification = createAsyncThunk(
    'notifications/add',
    async ({ accesstoken, data }, thunkAPI) => {
        try {
            const response = await createNotification(accesstoken, data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const removeNotification = createAsyncThunk(
    'notifications/remove',
    async ({ accesstoken, notificationId }, thunkAPI) => {
        try {
            const response = await markAsReadNotification(accesstoken, notificationId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.notifications = [];
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addNotification.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNotification.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addNotification.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeNotification.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeNotification.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(removeNotification.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default notificationSlice.reducer;