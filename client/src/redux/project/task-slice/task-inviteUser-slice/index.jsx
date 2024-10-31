import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inviteMemberTask } from '~/apis/Project/taskService';

export const inviteMember = createAsyncThunk(
    'task/inviteTaskUser',
    async ({ accesstoken, data }, thunkAPI) => {
        try {
        const response = await inviteMemberTask(accesstoken, data);
        return response;
        } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
    );

const inviteTaskUserSlice = createSlice({
    name: 'inviteTaskUser',
    initialState: {
        success: false,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(inviteMember.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(inviteMember.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        })
        .addCase(inviteMember.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default inviteTaskUserSlice.reducer;




// {
//     "message": "Member added to task successfully",
//     "member": {
//         "memberId": "6721dd4a0879c24f17f07766",
//         "is_active": true,
//         "task_id": "6723495a22bd64d3387f7011",
//         "user_invite": "6721dc240879c24f17f0772a",
//         "_id": "6723d0c2644877236f4ca387",
//         "createdAt": "2024-10-31T18:47:30.081Z",
//         "updatedAt": "2024-10-31T18:47:30.081Z",
//         "__v": 0
//     }
// }