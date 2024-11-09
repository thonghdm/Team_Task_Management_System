import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createNewComment, updateComment } from '~/apis/Project/commentService';

export const createComment = createAsyncThunk(
    'comment/create',
    async ({ accesstoken, data }, thunkAPI) => {
        try {
            const response = await createNewComment(accesstoken, data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const editComment = createAsyncThunk(
    'comment/edit',
    async ({ accesstoken, data }, thunkAPI) => {
        try {
            const response = await updateComment(accesstoken, data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const commentSlice = createSlice({
    name: 'comment',
    initialState: {
        comment: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createComment.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.comment = null;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.loading = false;
                state.comment = action.payload;
            })
            .addCase(createComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(editComment.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.comment = null;
            })
            .addCase(editComment.fulfilled, (state, action) => {
                state.loading = false;
                state.comment = action.payload;
            })
            .addCase(editComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default commentSlice.reducer;



// {
//     "message": "Comment created successfully!",
//     "comment": {
//         "_id": "6723bc00f4e3fb83bab6e8af",
//         "task_id": "67227171a79de1ef39d6a5b8",
//         "user_id": "6721dc240879c24f17f0772a",
//         "content": "hayy qua",
//         "is_active": true,
//         "createdAt": "2024-10-31T17:18:56.517Z",
//         "updatedAt": "2024-10-31T17:18:56.517Z",
//         "__v": 0
//     }