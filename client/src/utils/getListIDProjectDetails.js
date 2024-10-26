
export function getListIDProjectDetails(projectData) {
    if (!projectData) {
        return [];
      }
      const data = projectData.project || projectData;
      if (!data.lists || !Array.isArray(data.lists)) {
        return [];
      }
    const project = projectData.project;
    const projectId = project._id;
    const projectName = project.projectName;
    const lists = project.lists.map(list => ({
        listId: list._id,
        listName: list.list_name,
    }));

    return {
        projectId,
        projectName,
        lists,
    };
}
