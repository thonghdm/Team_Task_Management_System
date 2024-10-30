// inviteSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inviteMember, deleteMemberProject, updateMemberRole } from '~/apis/Project/projectRoleService';

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

export const fetchDeleteMember = createAsyncThunk(
    'memberProject/deleteMember',
    async ({ accesstoken, data }, thunkAPI) => {
        try {
            const response = await deleteMemberProject(accesstoken, data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchUpdateMemberRole = createAsyncThunk(
    'memberProject/updateRole',
    async ({ accesstoken, data, roleId }, thunkAPI) => {
        try {
            const response = await updateMemberRole(accesstoken, data, roleId);
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
            })
            .addCase(fetchDeleteMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeleteMember.fulfilled, (state, action) => {
                state.loading = false;
                state.members = action.payload;
            })
            .addCase(fetchDeleteMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchUpdateMemberRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUpdateMemberRole.fulfilled, (state, action) => {
                state.loading = false;
                state.members = action.payload;
            })
            .addCase(fetchUpdateMemberRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export const { resetInviteStatus } = inviteSlice.actions;
export default inviteSlice.reducer;
