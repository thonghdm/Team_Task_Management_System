import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { updateProject, getAllProjects } from '~/apis/Project/projectService';

export const updateProjectThunk = createAsyncThunk(
    'project/updateThunk',
    async ({ accesstoken, projectId, projectData }, thunkAPI) => {
        try {
            const data = await updateProject(accesstoken, projectId, projectData);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchProjectsThunk = createAsyncThunk(
    'project/fetchProjectsThunk',
    async ({ accesstoken }, thunkAPI) => {
        try {
            const data = await getAllProjects(accesstoken);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const projectThunkSlice = createSlice({
    name: 'projectThunk',
    initialState: {
        project: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateProjectThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProjectThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.project = action.payload;
            })
            .addCase(updateProjectThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchProjectsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.project = action.payload;
            })
            .addCase(fetchProjectsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default projectThunkSlice.reducer;