import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {createNewLabel} from '~/apis/Project/labelService';

export const createLabel = createAsyncThunk(
    'label/create',
    async ({ accesstoken, data }, thunkAPI) => {
        try {
        const response = await createNewLabel(accesstoken, data);
        return response;
        } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
    );

const labelSlice = createSlice({
    name: 'label',
    initialState: {
        label: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createLabel.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createLabel.fulfilled, (state, action) => {
            state.loading = false;
            state.label = action.payload;
        })
        .addCase(createLabel.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default labelSlice.reducer;


// {
//     "message": "Label created successfully!",
//     "label": {
//         "_id": "6723bbfcf4e3fb83bab6e8ab",
//         "task_id": "67227171a79de1ef39d6a5b8",
//         "color": "red",
//         "name": "nameA11",
//         "is_active": true,
//         "createdAt": "2024-10-31T17:18:52.762Z",
//         "updatedAt": "2024-10-31T17:18:52.762Z",
//         "__v": 0
//     }
// }