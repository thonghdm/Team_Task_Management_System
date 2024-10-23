export function getListIDProjectDetails(projectData) {
    console.log('getListIDProjectDetails',projectData)
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

