// Hàm tạo ID ngẫu nhiên
const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const convertedDataTimeline = (data) => {
    // Kiểm tra data có hợp lệ không
    if (!data || !Array.isArray(data)) {
        return [];
    }

    // Tạo map để nhóm các task theo user
    const userTaskMap = new Map();

    // Lấy tất cả tasks từ các list
    const allTasks = data.flatMap(list => list.tasks || []);
    // Xử lý từng task
    allTasks.forEach(task => {
        if (!task._id) return;

        // Chuẩn bị data chung của task
        const commonTaskData = {
            id: task._id,
            title: task.task_name || "No title available",
            startDate: new Date(task.start_date),
            endDate: new Date(task.end_date),
            subtitle: task.status || "No description available",
            bgColor: task.color || "No color available",
            occupancy: 0
        };

        // Xử lý assigned users
        const assignedUsers = task?.assigned_to_id?.length > 0 && Array.isArray(task?.assigned_to_id)
            ? task.assigned_to_id
            : ['unassigned'];

        assignedUsers.forEach(userId => {
            const assigned = userId === 'unassigned' 
                ? null 
                : task.assigneds.find(a => a._id === userId);

            const userKey = assigned 
                ? `${assigned.userInfo[0]?.username || 'unknown'}-${assigned.userInfo[0]?.displayName || 'unnamed'}`
                : 'unassigned';

            if (!userTaskMap.has(userKey)) {
                userTaskMap.set(userKey, {
                    id: generateRandomId(),
                    label: {
                        icon: assigned?.userInfo[0]?.image || "",
                        title: assigned?.userInfo[0]?.displayName || "NO USER",
                        subtitle: assigned?.userInfo[0]?.username || "NO USERNAME",
                        _id: assigned?.userInfo[0]?._id || "404ID"
                    },
                    data: []
                });
            }

            // Thêm task vào mảng data của user
            userTaskMap.get(userKey).data.push(commonTaskData);
        });
    });

    // Chuyển đổi Map thành mảng kết quả
    return Array.from(userTaskMap.values());
};