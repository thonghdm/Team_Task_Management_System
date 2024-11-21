

export const transformDataCal = (tasks) => {
    // Check if tasks is an array
    if (!tasks) {
      return [];
    }
    return Array.isArray(tasks) ? tasks.map(task => {
      if (!task?.task_id) {
        return null; // Skip tasks without task_id
      }
      return {
        id: task?.task_id?._id,
        title: task?.task_id?.task_name || "No title available", // Default title if not provided
        start: new Date(task?.task_id?.start_date),
        end: new Date(task?.task_id?.end_date),
        desc: task?.task_id?.description || "No description available", // Default description if not provided
        color: task?.task_id?.color || "No color available", // Default color if not provided
        tipo: task?.task_id?.project_id?.projectName // Mapping status to "Hoàn thành" or "Chưa hoàn thành"
      };
    }).filter(task => task !== null) : [];
  }



  // export const transformDataCal = (tasks) => {
  //   if (!tasks || !Array.isArray(tasks)) {
  //     return [];
  //   }
  //   return tasks
  //     .map(task => {
  //       if (!task?.task_id) {
  //         return null; // Skip tasks without task_id
  //       }
  
  //       const { task_id } = task;
  //       return {
  //         id: task_id._id,
  //         title: task_id.task_name || "No title available",
  //         start: task_id.start_date ? new Date(task_id.start_date) : new Date(),
  //         end: task_id.end_date ? new Date(task_id.end_date) : new Date(),
  //         desc: task_id.description 
  //           ? task_id.description.replace(/<\/?[^>]+(>|$)/g, "") 
  //           : "No description available",
  //         color: task_id.color || "#FFFFFF", // Default white if no color is provided
  //         tipo: task_id.project_id?.projectName || "No project name",
  //         resource: Array.isArray(task_id.assigned_to_id) 
  //           ? task_id.assigned_to_id.map(user => user?.memberId?.displayName || "Unnamed")
  //           : [],
  //       };
  //     })
  //     .filter(task => task !== null); // Filter out invalid tasks
  // };
  
//   // Example usage
//   const duLieuDuAn = transformData([
//     {
//       "id": "673dc00c0a9e9ad4b79942cf",
//       "task_name": "1http://localhost:3000/board/673dbd3b2c600c63b94a9ac3/2/task-boardhttp://localhost:3000/board/673dbd3b2c60",
//       "list_name": "1",
//       "status": "Completed",
//       "labels": [
//         {
//           "color": "#2ec27e",
//           "name": "khong"
//         }
//       ],
//       "members": [
//         {
//           "name": "Hoàng Thông",
//           "avatar": "https://lh3.googleusercontent.com/a/ACg8ocLonOZqEi_rfs9pTnHoFTpY-EygA1tHb5uJav3I8A14BtqFhzdA=s96-c"
//         }
//       ],
//       "comments": 0,
//       "end_date": "2024-11-21T15:51:26.913Z",
//       "start_date": "2024-11-13T10:54:26.906Z",
//       "name": ".",
//       "list": ".",
//       "dueDate": "2024-11-21T15:51:26.913Z"
//     },
//     {
//       "id": "673dc3ed0a9e9ad4b7994381",
//       "task_name": "next we",
//       "list_name": "1",
//       "status": "To Do",
//       "labels": [
//         "."
//       ],
//       "members": [
//         {
//           "name": "Hoàng Thông",
//           "avatar": "https://lh3.googleusercontent.com/a/ACg8ocLonOZqEi_rfs9pTnHoFTpY-EygA1tHb5uJav3I8A14BtqFhzdA=s96-c"
//         }
//       ],
//       "comments": 0,
//       "end_date": "2024-11-22T11:11:16.456Z",
//       "start_date": "2024-11-20T11:11:16.440Z",
//       "name": ".",
//       "list": ".",
//       "dueDate": "2024-11-22T11:11:16.456Z"
//     },
//     {
//       "id": "673dd279470abba73751a56f",
//       "task_name": "text done",
//       "list_name": "1",
//       "status": "Completed",
//       "labels": [
//         "."
//       ],
//       "members": [
//         {
//           "name": "Hoàng Thông",
//           "avatar": "https://lh3.googleusercontent.com/a/ACg8ocLonOZqEi_rfs9pTnHoFTpY-EygA1tHb5uJav3I8A14BtqFhzdA=s96-c"
//         }
//       ],
//       "comments": 0,
//       "end_date": "2024-11-22T12:13:36.545Z",
//       "start_date": "2024-11-20T12:13:36.545Z",
//       "name": ".",
//       "list": ".",
//       "dueDate": "2024-11-22T12:13:36.545Z"
//     },
//     {
//       "id": "673dd457470abba73751a65a",
//       "task_name": "tast comp tre",
//       "list_name": "1",
//       "status": "Completed",
//       "labels": [
//         "."
//       ],
//       "members": [
//         {
//           "name": "Hoàng Thông",
//           "avatar": "https://lh3.googleusercontent.com/a/ACg8ocLonOZqEi_rfs9pTnHoFTpY-EygA1tHb5uJav3I8A14BtqFhzdA=s96-c"
//         }
//       ],
//       "comments": 0,
//       "end_date": "2024-09-11T12:21:19.998Z",
//       "start_date": "2024-09-05T12:21:19.994Z",
//       "name": ".",
//       "list": ".",
//       "dueDate": "2024-09-11T12:21:19.998Z"
//     },
//     {
//       "id": "673dd869470abba73751a84e",
//       "task_name": "test sau 30",
//       "list_name": "1",
//       "status": "To Do",
//       "labels": [
//         "."
//       ],
//       "members": [
//         {
//           "name": "Hoàng Thông",
//           "avatar": "https://lh3.googleusercontent.com/a/ACg8ocLonOZqEi_rfs9pTnHoFTpY-EygA1tHb5uJav3I8A14BtqFhzdA=s96-c"
//         }
//       ],
//       "comments": 1,
//       "end_date": "2024-11-02T12:38:51.069Z",
//       "start_date": "2024-11-01T12:38:51.061Z",
//       "name": ".",
//       "list": ".",
//       "dueDate": "2024-11-02T12:38:51.069Z"
//     },
//     {
//       "id": "673e1178ce046de8790db3c3",
//       "task_name": "Helo color",
//       "list_name": "1",
//       "status": "To Do",
//       "labels": [
//         "."
//       ],
//       "members": [
//         {
//           "name": ".",
//           "avatar": ""
//         }
//       ],
//       "comments": 0,
//       "end_date": "2024-11-28T16:42:22.773Z",
//       "start_date": "2024-11-20T16:42:20.169Z",
//       "name": ".",
//       "list": ".",
//       "dueDate": "2024-11-28T16:42:22.773Z"
//     }
//   ]);
  
//   console.log(duLieuDuAn);
  