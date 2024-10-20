const slugify = require('~/utils/formattersSlugify')
const { Project } = require('~/models/ProjectSchema')

const createNew = async (reqBody) => {
    try {
        const newProjectData = {
            ...reqBody,
            slug: slugify(reqBody.projectName)
        };
        const newProject = new Project(newProjectData)
        const createdProject = await newProject.save()
        return createdProject
    } catch (error) {
        throw new Error(error)
    }
}
const getDetails = async (projectId) => {
    try {
        const projectDetails = await Project.findById(projectId)
        if (!projectDetails) {
            throw new Error('Project not found projectId')
        }
        return projectDetails
    } catch (error) {
        throw new Error(error)
    }
}

const getAllByOwnerId = async (ownerId) => {
    try {
        const projects = await Project.find({ ownerId: ownerId })
        if (!projects) {
            throw new Error('Project not found ownerId')
        }
        return projects
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = { createNew, getDetails, getAllByOwnerId }