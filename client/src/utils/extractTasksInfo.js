export function extractTasksInfo(project) {
    const tasksInfo = [];
    if (!project.lists) return tasksInfo;

    project.lists.forEach(list => {
        list.tasks.forEach(task => {
            tasksInfo.push({
                id: task._id,
                task_name: task.task_name,
                list_name: list.list_name,
                status: task.status,
                labels: task.label_id.length 
                    ? task.label_id.map(label => ({ color: label.color, name: label.name })) 
                    : [],
                members: task.assigned_to_id.length 
                    ? task.assigned_to_id.map(member => ({ name: member.name, url: member.url })) 
                    : [],
                comments: task.comment_id.length ? task.comment_id.join(", ") : "",
                end_date: task.end_date || ""  // Assuming there's a due date field if added
            });
        });
    });

    return tasksInfo;
}
