import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createNewAuditLog } from "~/apis/Project/auditLogService";

export const createAuditLog = createAsyncThunk(
    "auditLog/create",
    async ({ accesstoken, data }, thunkAPI) => {
        try {
        const response = await createNewAuditLog(accesstoken, data);
        return response;
        } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
    );

const auditLogSlice = createSlice({
    name: "auditLog",
    initialState: {
        auditLog: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createAuditLog.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.auditLog = null;
        })
        .addCase(createAuditLog.fulfilled, (state, action) => {
            state.loading = false;
            state.auditLog = action.payload;
        })
        .addCase(createAuditLog.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});


export default auditLogSlice.reducer;
