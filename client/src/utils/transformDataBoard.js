export const transformDataBoard = (data) => {
    // Check if data is null or undefined
    if (!data) return { columns: [] };

    // Map the input data to the desired structure
    const mockData = {
        columns: data?.map(list => ({
            _id: list._id,
            title: list.list_name,
            cardOrderIds: list.task_id || [],
            cards: (list.tasks || []).map(task => ({
                _id: task._id,
                columnId: task.list_id,
                title: task.task_name,
                description: task.description,
                // checklist: task.checklist || false,
                // status: task.status || 'To Do',
                // priority: task.priority || 'Medium',
                memberIds: task.assigned_to_id || [],
                attachments: task.attachments_id || [],
                // startDate: task.start_date,
                // endDate: task.end_date,
                // color: task.color || '#000000',
                // labels: task.labels || [],
                // comments: task.comments || [],
            }))
        }))
    };

    return mockData;
};