import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inviteMemberTask, updateMemberTask, getTaskByMemberID } from '~/apis/Project/MemberTaskService';

export const inviteUserTask = createAsyncThunk(
    'task/inviteUser',
    async ({ accesstoken, data }, thunkAPI) => {
        try {
            const response = await inviteMemberTask(accesstoken, data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateMemberTaskThunks = createAsyncThunk(
    'task/updateMemberTask',
    async ({ accesstoken, data }, thunkAPI) => {
        try {
            const response = await updateMemberTask(accesstoken, data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getTaskByMemberIDThunk = createAsyncThunk(
    'task/getTaskByMemberID',
    async ({ accesstoken, memberID }, thunkAPI) => {
        try {
            const response = await getTaskByMemberID(accesstoken, memberID);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);


const taskInviteUserSlice = createSlice({
    name: 'taskInviteUser',
    initialState: {
        success: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(inviteUserTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(inviteUserTask.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload;
            })
            .addCase(inviteUserTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateMemberTaskThunks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMemberTaskThunks.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload;
            })
            .addCase(updateMemberTaskThunks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getTaskByMemberIDThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTaskByMemberIDThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload;
            })
            .addCase(getTaskByMemberIDThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

export default taskInviteUserSlice.reducer;