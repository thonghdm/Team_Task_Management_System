export const transformDataCal = (tasks) => {
    if (!tasks) {
      return [];
    }
    return Array.isArray(tasks) 
      ? tasks
          .filter(task => task?.task_id?.project_id?.isActive === true)
          .map(task => {
            if (!task?.task_id) {
              return null;
            }
            return {
              id: task?.task_id?._id,
              title: task?.task_id?.task_name || "No title available",
              start: new Date(task?.task_id?.start_date),
              end: new Date(task?.task_id?.end_date),
              desc: task?.task_id?.description || "No description available", // Default description if not provided
              color: task?.task_id?.color || "No color available", // Default color if not provided
              tipo: task?.task_id?.project_id?.projectName // Mapping status to "Hoàn thành" or "Chưa hoàn thành"
            };
          })
          .filter(task => task !== null) 
      : [];
  }

