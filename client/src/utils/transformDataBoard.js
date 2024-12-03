export const transformDataBoard = (data) => {
    // Check if data is null or undefined
    if (!data) return { lists: [] };

    // Map the input data to the desired structure
    const mockData = {
        lists: data?.map(list => ({
            _id: list._id,
            list_name: list.list_name,
            task_id: list.task_id || [],
            tasks: (list.tasks || []).map(task => ({
                // _id: task._id,
                // list_id: task.list_id,
                // task_name: task.task_name,
                // description: task.description,
                // // checklist: task.checklist || false,
                // // status: task.status || 'To Do',
                // // priority: task.priority || 'Medium',
                // assigned_to_id: task.assigned_to_id || [],
                // attachments_id: task.attachments_id || [],
                // // startDate: task.start_date,
                // // endDate: task.end_date,
                // // color: task.color || '#000000',
                // // labels: task.labels || [],
                // comments: task.comments || [],
                ...task
            }))
        }))
    };

    return mockData;
};