import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getSubscriptionByUser } from '~/apis/Project/subscriptionApi'

export const getSubscriptionByUserThunks = createAsyncThunk(
    'subscription/getSubscriptionByUserThunks',
    async ({ accesstoken, userId }, thunkAPI) => {
        try {
            const response = await getSubscriptionByUser(accesstoken, userId)
            return response
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message)
        }
    }
)

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState: {
        subscription: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSubscriptionByUserThunks.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getSubscriptionByUserThunks.fulfilled, (state, action) => {
                state.loading = false
                state.subscription = action.payload
            })
            .addCase(getSubscriptionByUserThunks.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export default subscriptionSlice.reducer