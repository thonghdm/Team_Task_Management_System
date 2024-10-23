const slugify = require('~/utils/formattersSlugify')
const Project = require('~/models/ProjectSchema')
const mongoose = require('mongoose')
const _ = require('lodash')

const createNew = async (reqBody) => {
    try {
        const newProjectData = {
            ...reqBody,
            slug: slugify(reqBody.projectName)
        }
        const newProject = new Project(newProjectData)
        const createdProject = await newProject.save()
        return createdProject
    } catch (error) {
        throw new Error(error)
    }
}

/// get data chi tiet
const getDetails = async (projectId) => {
    try {
        const projectDetails = await getDetailsProject(projectId)
        if (!projectDetails) {
            throw new Error('Project not found projectId')
        }

        let resProject = _.cloneDeep(projectDetails)
        if (resProject) {
            resProject.lists.forEach(list => {
                list.tasks = resProject.tasks.filter(task => task.list_id.toString() === list._id.toString())
            })
            delete resProject.tasks
            return resProject
        }
        return projectDetails
    } catch (error) {
        throw new Error(error)
    }
}
/// Get data chi tiet
const getDetailsProject = async (projectId) => {
    try {
        const res = await Project.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(projectId),
                    isActive: true
                }
            },
            {
                $lookup: {
                    from: 'lists',
                    localField: '_id',
                    foreignField: 'project_id',
                    as: 'lists'
                }
            },
            {
                $lookup: {
                    from: 'tasks',
                    localField: '_id',
                    foreignField: 'project_id',
                    as: 'tasks'
                }
            }
        ])
        return res[0] || {}
    } catch (error) {
        throw new Error(`Error getDetailsProject: ${error.message}`)
    }
}
///
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

const getAllByMemberId = async (memberId) => {
    try {
        const projects = await Project.find({ membersId: memberId })
        if (!projects || projects.length === 0) {
            throw new Error('No projects found for this memberId')
        }
        return projects
    } catch (error) {
        throw new Error(error.message)
    }
}
module.exports = { createNew, getDetails, getAllByOwnerId, getAllByMemberId }