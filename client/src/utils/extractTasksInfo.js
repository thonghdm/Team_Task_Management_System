export function extractTasksInfo(project) {
    const tasksInfo = [];
    if (!project?.lists) return tasksInfo;

    project?.lists?.forEach(list => {
        list?.tasks?.forEach(task => {
            tasksInfo?.push({
                id: task?._id,
                task_name: task?.task_name,
                list_name: list?.list_name,
                status: task?.status,
                labels: task?.labels?.length
                    ? task?.labels?.map(label => ({ color: label.color, name: label.name }))
                    : [],
                // members: task?.assigneds?.length 
                // ? task?.assigneds?.map(member => ({ name: member.displayName, avatar: member.image })) 
                // : [],
                members: task?.assigneds?.length
                    ? task?.assigneds.flatMap(assigned =>
                        assigned?.userInfo?.map(member => ({
                            _id: member._id,
                            name: member.displayName,
                            avatar: member.image,
                            is_active: member.is_active
                        }))
                    )
                    : [],
                comments: task?.comments?.length ? task?.comments.map(cmt => cmt._id) : [],
                end_date: task?.end_date || "",
                start_date: task?.start_date || "",
                priority: task?.priority || "",
                task_review_status: task?.task_review_status || "",
            });
        });
    });

    return tasksInfo;
}
