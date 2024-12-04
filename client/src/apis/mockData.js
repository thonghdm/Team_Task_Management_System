// mockData.js

const imgTest = "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg";

const mockData = {
  lists: [
    {
      _id: 'column-1',
      list_name: 'To Do',
      task_id: ['card-1', 'card-2'],
      tasks: [
        {
          _id: 'card-1',
          task_name: 'Task 1',
          description: 'Description for Task 1',
          list_id: 'column-1',
          memberIds: ['test-user-id-01'],
          attachments: [
            'test attachment 01',
            'test attachment 02',
            'test attachment 03'
          ],
          // cover: imgTest,

        },
        {
          _id: 'card-2',
          task_name: 'Task 2',
          description: 'Description for Task 2',
          list_id: 'column-1'
        },
      ],
    },
    {
      _id: 'column-2',
      list_name: 'In Progress',
      task_id: ['card-3', 'card-4'],
      tasks: [
        {
          _id: 'card-3',
          task_name: 'Task 3',
          description: 'Description for Task 3',
          list_id: 'column-2'
        },
        {
          _id: 'card-4',
          task_name: 'Task 4',
          description: 'Description for Task 4',
          list_id: 'column-2'
        },
      ],
    },
    {
      _id: 'column-3',
      list_name: 'Done',
      task_id: ['card-5'],
      tasks: [
        {
          _id: 'card-5',
          task_name: 'Task 5',
          description: 'Description for Task 5',
          list_id: 'column-3'
        },
      ],
    },
  ],
};

export default mockData;
