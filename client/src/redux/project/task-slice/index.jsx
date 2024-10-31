import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTasksById } from '~/apis/Project/taskService';

// Create async thunk with the function already defined
export const fetchTaskById = createAsyncThunk(
  'task/fetchById',
  async ({ accesstoken, taskId }, thunkAPI) => {
    try {
      // Call the defined API function
      const data = await getTasksById(accesstoken, taskId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create slice for Redux Toolkit
const taskSlice = createSlice({
  name: 'task',
  initialState: {
    task: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.task = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    },
});

export default taskSlice.reducer;


// {
//   "_id": "67227171a79de1ef39d6a5b8",
//   "project_id": "6721dc650879c24f17f07737",
//   "list_id": "67227030a79de1ef39d6a583",
//   "task_name": "thaaaaa",
//   "checklist": false,
//   "status": "To Do",
//   "priority": "Medium",
//   "assigned_to_id": [
//       {
//           "_id": "6721dc240879c24f17f0772a",
//           "email": "hoangdinhthongbmt@gmail.com",
//           "image": "https://lh3.googleusercontent.com/a/ACg8ocLonOZqEi_rfs9pTnHoFTpY-EygA1tHb5uJav3I8A14BtqFhzdA=s96-c",
//           "displayName": "Hoàng Thông"
//       }
//   ],
//   "start_date": null,
//   "is_active": true,
//   "comment_id": [
//       {
//           "_id": "672364da403a8dce670462a5",
//           "user_id": "6721dc240879c24f17f0772a",
//           "content": "hayy qua",
//           "createdAt": "2024-10-31T11:07:06.490Z"
//       },
//       {
//           "_id": "672368a63649e925d85fd5ec",
//           "user_id": "6721dc240879c24f17f0772a",
//           "content": "hayy qua",
//           "createdAt": "2024-10-31T11:23:18.969Z"
//       },
//       {
//           "_id": "672368cc3649e925d85fd5f0",
//           "user_id": "6721dc240879c24f17f0772a",
//           "content": "hayy qua",
//           "createdAt": "2024-10-31T11:23:56.704Z"
//       },
//       {
//           "_id": "6723bc00f4e3fb83bab6e8af",
//           "user_id": "6721dc240879c24f17f0772a",
//           "content": "hayy qua",
//           "createdAt": "2024-10-31T17:18:56.517Z"
//       }
//   ],
//   "attachments_id": [
//       "672364da403a8dce670462a5"
//   ],
//   "label_id": [
//       {
//           "_id": "6723685b196914be2706cffc",
//           "color": "red",
//           "name": "nameA11",
//           "createdAt": "2024-10-31T11:22:03.414Z"
//       },
//       {
//           "_id": "6723bbfcf4e3fb83bab6e8ab",
//           "color": "red",
//           "name": "nameA11",
//           "createdAt": "2024-10-31T17:18:52.762Z"
//       }
//   ],
//   "createdAt": "2024-10-30T17:48:33.848Z",
//   "updatedAt": "2024-10-31T17:18:56.520Z",
//   "__v": 0
// }