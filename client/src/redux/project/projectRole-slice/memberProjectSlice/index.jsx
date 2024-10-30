// memberProjectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMemberProject} from '~/apis/Project/projectRoleService';

// Async thunk for fetching project members
export const fetchMemberProject = createAsyncThunk(
    'memberProject/fetchMembers',
    async ({ accesstoken, projectId }, thunkAPI) => {
        try {
            const response = await getMemberProject(accesstoken, projectId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);



// Slice for managing project members
const memberProjectSlice = createSlice({
    name: 'memberProject',
    initialState: {
        members: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetMemberProject: (state) => {
            state.members = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMemberProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMemberProject.fulfilled, (state, action) => {
                state.loading = false;
                state.members = action.payload;
            })
            .addCase(fetchMemberProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

// Export actions and reducer
export const { resetMemberProject } = memberProjectSlice.actions;
export default memberProjectSlice.reducer;
