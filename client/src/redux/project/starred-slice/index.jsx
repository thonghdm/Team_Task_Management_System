import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createNewStarred, getStarred, updateStarred } from '~/apis/Project/starredsApi'

export const createStarred = createAsyncThunk(
    'starred/create',
    async ({ accesstoken, data }, thunkAPI) => {
        try {
            const response = await createNewStarred(accesstoken, data)
            return response
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const getStarredThunks = createAsyncThunk(
    'starred/get',
    async ({ accesstoken, memberId }, thunkAPI) => {
        try {
            const response = await getStarred(accesstoken, memberId)
            return response
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const updateStarredThunks = createAsyncThunk(
    'starred/update',
    async ({ accesstoken, data }, thunkAPI) => {
        try {
            const response = await updateStarred(accesstoken, data)
            return response
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message)
        }
    }
)

const starredSlice = createSlice({
    name: 'starred',
    initialState: {
        starred: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createStarred.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createStarred.fulfilled, (state, action) => {
                state.loading = false
                state.starred = action.payload
            })
            .addCase(createStarred.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getStarredThunks.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getStarredThunks.fulfilled, (state, action) => {
                state.loading = false
                state.starred = action.payload
            })
            .addCase(getStarredThunks.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateStarredThunks.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateStarredThunks.fulfilled, (state, action) => {
                state.loading = false
                state.starred = action.payload
            })
            .addCase(updateStarredThunks.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export default starredSlice.reducer