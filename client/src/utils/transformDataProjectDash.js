const monthMap = {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
    '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
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
    const participantTrend = [];
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 5);

    let cumulativeTotalMembers = 0;

    data?.forEach(list => {
        list.tasks.forEach(task => {
            const taskDate = new Date(task.start_date);
            if (taskDate >= sixMonthsAgo && taskDate <= currentDate) {
                const month = monthMap[task.start_date.split('-')[1]];
                let monthData = participantTrend.find(data => data.month === month);
                
                if (!monthData) {
                    monthData = { month, total_members: 0, new_members: 0 };
                    participantTrend.push(monthData);
                }

                monthData.new_members++;
            }
        });
    });

    participantTrend?.sort((a, b) => new Date(`2024-${a.month.split(' ')[1]}`) - new Date(`2024-${b.month.split(' ')[1]}`));

    participantTrend?.forEach(monthData => {
        cumulativeTotalMembers += monthData.new_members;
        monthData.total_members = cumulativeTotalMembers;
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

export const getStats =  (data) => {
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
            color: '#2196f3'
        },
        {
            title: 'Total Attachments',
            value: totalAttachments.toString(),
            subtext: `${attachmentsThisMonth} upload this month`,
            color: '#4caf50'
        },
        {
            title: 'Total Tasks',
            value: totalTasks.toString(),
            subtext: `${tasksThisMonth} tasks created this month`,
            color: '#ff9800'
        },
        {
            title: 'Total Labels',
            value: totalLabels.toString(),
            subtext: `${labelsThisMonth} labels created this month`,
            color: '#f44336'
        }
    ];

    return stats;
}
