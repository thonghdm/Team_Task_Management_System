export const transformDataCalProject = (data) => {
    // Check if data is an array
    if (!data || !Array.isArray(data)) {
        return [];
    }

    // Flatten the tasks from all lists
    const allTasks = data.flatMap(list => list.tasks || []);
    return allTasks.map(task => ({
        id: task._id,
        title: task.task_name || "No title available",
        start: new Date(task.start_date),
        end: new Date(task.end_date),
        desc: task.description || "No description available",
        color: task.color || "No color available",
        // status: task.status || "Unknown status"
    })).filter(task => task.id);
}