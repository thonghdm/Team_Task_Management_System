// inviteSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inviteMember } from '~/apis/Project/projectRoleService';

// Async thunk for inviting a member
export const inviteMemberAsync = createAsyncThunk(
    'invite/inviteMember',
    async ({ accesstoken, inviteData }, thunkAPI) => {
        try {
            const response = await inviteMember(accesstoken, inviteData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Invite member slice
const inviteSlice = createSlice({
    name: 'invite',
    initialState: {
        loading: false,
        success: null,
        error: null,
    },
    reducers: {
        resetInviteStatus: (state) => {
            state.loading = false;
            state.success = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(inviteMemberAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(inviteMemberAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload;
            })
            .addCase(inviteMemberAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export const { resetInviteStatus } = inviteSlice.actions;
export default inviteSlice.reducer;
