const monthMap = {
    '01': 'January', '02': 'February', '03': 'March', '04': 'April',
    '05': 'May', '06': 'June', '07': 'July', '08': 'August',
    '09': 'September', '10': 'October', '11': 'November', '12': 'December'
};

// const monthOrder = Object.values(monthMap);

export const transformDataTaskDetails = (data) => {
    const taskProgressData = [];

    data?.forEach(list => {
        list.tasks.forEach(task => {
            const month = monthMap[task?.start_date?.split('-')[1]];
            let monthData = taskProgressData.find(data => data.month === month);

            if (!monthData) {
                monthData = { month, tasks: 0, done: 0, todo: 0, incoming: 0 };
                taskProgressData.push(monthData);
            }

            monthData.tasks++;
            if (task.status === 'Completed') {
                monthData.done++;
            } else if (task.status === 'To Do') {
                monthData.todo++;
            } else if (task.status === 'In Progress') {
                monthData.incoming++;
            }
        });
    });

    // taskProgressData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));


    return taskProgressData;
}


export const getParticipantTrend = (data) => {
    if (!data || !Array.isArray(data)) return [];

    const participantTrend = [];
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 5);

    // Initialize data for last 6 months
    for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setMonth(currentDate.getMonth() - i);
        const month = monthMap[String(date.getMonth() + 1).padStart(2, '0')];
        participantTrend.unshift({
            month,
            total_members: 0,
            new_members: 0,
            unique_members: new Set() // Track unique members
        });
    }

    // Process API data
    data.forEach(list => {
        if (!list.tasks || !Array.isArray(list.tasks)) return;

        list.tasks.forEach(task => {
            if (!task.start_date) return;

            const taskDate = new Date(task.start_date);
            if (taskDate >= sixMonthsAgo && taskDate <= currentDate) {
                const month = monthMap[String(taskDate.getMonth() + 1).padStart(2, '0')];
                const monthData = participantTrend.find(data => data.month === month);

                if (monthData) {
                    // Count new members from assigned_to_id
                    if (task.assigned_to_id && Array.isArray(task.assigned_to_id)) {
                        task.assigned_to_id.forEach(memberId => {
                            if (!monthData.unique_members.has(memberId)) {
                                monthData.new_members++;
                                monthData.unique_members.add(memberId);
                            }
                        });
                    }

                    // Count task creator if not already counted
                    if (task.created_by_id && !monthData.unique_members.has(task.created_by_id)) {
                        monthData.new_members++;
                        monthData.unique_members.add(task.created_by_id);
                    }
                }
            }
        });
    });

    // Calculate cumulative total members and remove unique_members
    let cumulativeTotalMembers = 0;
    participantTrend.forEach(monthData => {
        cumulativeTotalMembers += monthData.new_members;
        monthData.total_members = cumulativeTotalMembers;
        delete monthData.unique_members; // Remove Set after use
    });

    return participantTrend;
}



export const getPriorityDistribution = (data) => {
    const priorityDistribution = [
        { name: 'Low', value: 0 },
        { name: 'Medium', value: 0 },
        { name: 'High', value: 0 }
    ];

    data?.forEach(list => {
        list.tasks.forEach(task => {
            const priorityData = priorityDistribution.find(p => p.name === task.priority);
            if (priorityData) {
                priorityData.value++;
            }
        });
    });

    return priorityDistribution;
}

export const getStats = (data) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let totalLists = 0;
    let listsThisMonth = 0;
    let totalAttachments = 0;
    let attachmentsThisMonth = 0;
    let totalTasks = 0;
    let tasksThisMonth = 0;
    let totalLabels = 0;
    let labelsThisMonth = 0;

    data?.forEach(list => {
        totalLists++;
        const listCreatedDate = new Date(list.createdAt);
        if (listCreatedDate.getMonth() === currentMonth && listCreatedDate.getFullYear() === currentYear) {
            listsThisMonth++;
        }

        list.tasks.forEach(task => {
            totalTasks++;
            const taskCreatedDate = new Date(task.createdAt);
            if (taskCreatedDate.getMonth() === currentMonth && taskCreatedDate.getFullYear() === currentYear) {
                tasksThisMonth++;
            }

            totalAttachments += task.attachments_id.length;
            if (task.attachments_id.length > 0 && taskCreatedDate.getMonth() === currentMonth && taskCreatedDate.getFullYear() === currentYear) {
                attachmentsThisMonth += task.attachments_id.length;
            }

            totalLabels += task.label_id.length;
            if (task.label_id.length > 0 && taskCreatedDate.getMonth() === currentMonth && taskCreatedDate.getFullYear() === currentYear) {
                labelsThisMonth += task.label_id.length;
            }
        });
    });

    const stats = [
        {
            title: 'Total Lists',
            value: totalLists.toString(),
            subtext: `${listsThisMonth} lists created this month`,
            gradient: 'linear-gradient(45deg, #42A5F5 30%, #90CAF9 90%)',
            iconBg: 'rgba(66, 165, 245, 0.15)',
            color: 'white'
        },
        {
            title: 'Total Attachments',
            value: totalAttachments.toString(),
            subtext: `${attachmentsThisMonth} upload this month`,
            gradient: 'linear-gradient(45deg, #66BB6A 30%, #A5D6A7 90%)',
            iconBg: 'rgba(102, 187, 106, 0.15)',
            color: 'white'
        },
        {
            title: 'Total Tasks',
            value: totalTasks.toString(),
            subtext: `${tasksThisMonth} tasks created this month`,
            gradient: 'linear-gradient(45deg, #FFA726 30%, #FFCC80 90%)',
            iconBg: 'rgba(255, 167, 38, 0.15)',
            color: 'white'
        },
        {
            title: 'Total Labels',
            value: totalLabels.toString(),
            subtext: `${labelsThisMonth} labels created this month`,
            gradient: 'linear-gradient(45deg, #EF5350 30%, #FF8A80 90%)',
            iconBg: 'rgba(239, 83, 80, 0.15)',
            color: 'white'
        }
    ];

    return stats;
}
