export function reorderLists(project) {
  if (!project || !project?.lists || !project?.listId) {
    return;
  }

  const { lists, listId } = project;

  // Sắp xếp các lists theo thứ tự của listId
  const orderedLists = listId?.map(id => {
    const list = lists?.find(l => l._id === id);
    
    // Kiểm tra nếu list tồn tại và có task_id
    if (list && list?.task_id && list?.tasks) {
      // Sắp xếp các tasks theo thứ tự trong task_id
      const orderedTasks = list?.task_id?.map(taskId => list?.tasks?.find(task => task._id === taskId));
      
      return {
        ...list,
        tasks: orderedTasks?.filter(task => task !== undefined) // Lọc bỏ các task undefined nếu có
      };
    }

    return list;
  });

  // Trả về project mới với lists đã được sắp xếp
  return {
    ...project,
    lists: orderedLists
  };
}
