export const calculateMemberStats = (data) => {
  const members = data?.users;
  const currentDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);

  // Calculate total inactive non-admin members
  const inactiveNonAdminMembers = members?.filter(member => member?.is_active && !member?.isAdmin);
  const totalInactiveNonAdminMembers = inactiveNonAdminMembers?.length;

  // Calculate members who joined in the last month
  const membersJoinedLastMonth = members?.filter(member => {
    const memberCreatedAt = new Date(member?.createdAt);
    return member?.is_active && !member?.isAdmin && memberCreatedAt >= oneMonthAgo;
  });
  const totalMembersJoinedLastMonth = membersJoinedLastMonth?.length;

  return {
    totalInactiveNonAdminMembers,
    totalMembersJoinedLastMonth
  };
};


export const calculateProjectStats = (data) => {
  const projects = data?.projects;
  const currentDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);

  let totalProjects = 0;
  let projectsCreatedLastMonth = 0;
  let totalTasks = 0;
  let tasksCreatedLastMonth = 0;
  let totalLists = 0;
  let listsCreatedLastMonth = 0;

  projects?.forEach(project => {
    if (!project.isActive) return; // Only consider active projects

    totalProjects++;

    const projectCreatedAt = new Date(project.createdAt);
    if (projectCreatedAt >= oneMonthAgo) {
      projectsCreatedLastMonth++;
    }

    project?.listId?.forEach(list => {
      totalLists++;

      const listCreatedAt = new Date(list?.createdAt);
      if (listCreatedAt >= oneMonthAgo) {
        listsCreatedLastMonth++;
      }

      list?.task_id?.forEach(task => {
        totalTasks++;

        const taskCreatedAt = new Date(task?.createdAt);
        if (taskCreatedAt >= oneMonthAgo) {
          tasksCreatedLastMonth++;
        }
      });
    });
  });

  return {
    totalProjects,
    projectsCreatedLastMonth,
    totalTasks,
    tasksCreatedLastMonth,
    totalLists,
    listsCreatedLastMonth
  };
};


export const normalizeData = (users) => {
  const parseDate = (dateString) => new Date(dateString);

  // Lọc chỉ những thành viên thỏa mãn điều kiện is_active && !isAdmin
  const activeNonAdminUsers = users.filter((user) => user.is_active && !user.isAdmin);

  // Helper function to group users by week
  const groupByWeek = (users) => {
    const result = {};
    users.forEach((user) => {
      const date = parseDate(user.createdAt);
      const weekNumber = Math.ceil(date.getDate() / 7);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      const key = `Week ${weekNumber} (${monthYear})`;

      if (!result[key]) {
        result[key] = 0;
      }
      result[key] += 1;
    });

    return Object.entries(result).map(([date, newMembers]) => ({ date, newMembers }));
  };

  // Helper function to group users by month
  const groupByMonth = (users) => {
    const result = {};
    users.forEach((user) => {
      const date = parseDate(user.createdAt);
      const key = date.toLocaleString('default', { month: 'short', year: 'numeric' });

      if (!result[key]) {
        result[key] = { newMembers: 0, activeMembers: 0 };
      }
      result[key].newMembers += 1;
      result[key].activeMembers += 1; // All are active due to filtering
    });

    return Object.entries(result).map(([date, { newMembers, activeMembers }]) => ({
      date,
      newMembers,
      activeMembers,
    }));
  };

  // Helper function to group users by day
  const groupByDay = (users) => {
    const result = {};
    users.forEach((user) => {
      const date = parseDate(user.createdAt).toLocaleDateString('default', {
        day: 'numeric',
        month: 'short',
      });

      if (!result[date]) {
        result[date] = 0;
      }
      result[date] += 1;
    });

    return Object.entries(result).map(([date, newMembers]) => ({ date, newMembers }));
  };

  const weeklyData = groupByDay(activeNonAdminUsers);
  const monthlyData = groupByWeek(activeNonAdminUsers);
  const quarterlyData = groupByMonth(activeNonAdminUsers);

  return { weeklyData, monthlyData, quarterlyData };
};

export const dataBigProject = (data) => {
  const projects = data?.projects;
  const activeProjects = [];

  projects?.forEach(project => {
    if (!project?.isActive) return;
    const name = project?.projectName;
    const members = project?.membersId?.length;
    const owner = project?.ownerId?.displayName;
    const color = project?.color;

    activeProjects.push({ name, members, owner, color });
  });

  // Sort the projects by the number of members in descending order
  activeProjects.sort((a, b) => b.members - a.members);

  // Return the top 5 projects with the most members
  return activeProjects.slice(0, 5);
};