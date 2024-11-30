import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createNewAuditLog_project } from "~/apis/Project/auditLogService";

export const createAuditLog_project = createAsyncThunk(
    "auditLog/create_project",
    async ({ accesstoken, data }, thunkAPI) => {
        try {
        const response = await createNewAuditLog_project(accesstoken, data);
        return response;
        } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
    );

const auditLogSlice_project = createSlice({
    name: "auditLog_project",
    initialState: {
        auditLog: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createAuditLog_project.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.auditLog = null;
        })
        .addCase(createAuditLog_project.fulfilled, (state, action) => {
            state.loading = false;
            state.auditLog = action.payload;
        })
        .addCase(createAuditLog_project.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default auditLogSlice_project.reducer;