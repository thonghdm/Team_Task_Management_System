// mockData.js

const imgTest = "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg";

const mockData = {
    columns: [
      {
        _id: 'column-1',
        title: 'To Do',
        cardOrderIds: ['card-1', 'card-2'],
        cards: [
          {
            _id: 'card-1',
            title: 'Task 1',
            description: 'Description for Task 1',
            columnId: 'column-1',
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
            title: 'Task 2',
            description: 'Description for Task 2',
            columnId: 'column-1'
          },
        ],
      },
      {
        _id: 'column-2',
        title: 'In Progress',
        cardOrderIds: ['card-3', 'card-4'],
        cards: [
          {
            _id: 'card-3',
            title: 'Task 3',
            description: 'Description for Task 3',
            columnId: 'column-2'
          },
          {
            _id: 'card-4',
            title: 'Task 4',
            description: 'Description for Task 4',
            columnId: 'column-2'
          },
        ],
      },
      {
        _id: 'column-3',
        title: 'Done',
        cardOrderIds: ['card-5'],
        cards: [
          {
            _id: 'card-5',
            title: 'Task 5',
            description: 'Description for Task 5',
            columnId: 'column-3'
          },
        ],
      },
    ],
  };
  
  export default mockData;
  