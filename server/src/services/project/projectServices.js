const slugify = require('~/utils/formattersSlugify')
const Project = require('~/models/ProjectSchema')
const ProjectRole = require('~/models/ProjectRoleSchema')
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
        // console.log(createdProject)

        const newRoleData = {
            projectId: createdProject._id,
            memberId: createdProject.ownerId,
            user_invite: createdProject.ownerId,
            isRole: 'Admin'
        }

        const newRole = new ProjectRole(newRoleData)
        const createdRole = await newRole.save()
        return { createdRole, createdProject }
    } catch (error) {
        throw new Error(error)
    }
}

// // Create a new project
// const createNew = async (reqBody) => {
//     const session = await mongoose.startSession()
//     session.startTransaction()
//     try {
//         const newProjectData = {
//             ...reqBody,
//             slug: slugify(reqBody.projectName)
//         }
//         const newProject = new Project(newProjectData)
//         const createdProject = await newProject.save({ session })

//         const newRoleData = {
//             projectId: createdProject._id,
//             memberId: createdProject.membersId[0],
//             isRole: 'Admin'
//         }
//         const newRole = new ProjectRole(newRoleData)
//         const createdRole = await newRole.save({ session })

//         await session.commitTransaction()

//         return { createdRole, createdProject }
//     } catch (error) {
//         await session.abortTransaction()
//         throw new Error(error)
//     } finally {
//         // Kết thúc session
//         session.endSession()
//     }
// }

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
            // Lookup lists
            {
                $lookup: {
                    from: 'lists',
                    localField: '_id',
                    foreignField: 'project_id',
                    as: 'lists'
                }
            },
            // Lookup tasks với labels
            {
                $lookup: {
                    from: 'tasks',
                    let: { projectId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$project_id', '$$projectId']
                                },
                                is_active: true
                            }
                        },
                        // Join với labels collection
                        {
                            $lookup: {
                                from: 'labels',
                                localField: 'label_id',
                                foreignField: '_id',
                                pipeline: [
                                    {
                                        $match: {
                                            is_active: true
                                        }
                                    },
                                    {
                                        $project: {
                                            name: 1,
                                            color: 1,
                                            createdAt: 1
                                        }
                                    }
                                ],
                                as: 'labels'
                            }
                        },
                        // Join với comment collection
                        {
                            $lookup: {
                                from: 'comments',
                                localField: 'comment_id',
                                foreignField: '_id',
                                pipeline: [
                                    {
                                        $match: {
                                            is_active: true
                                        }
                                    },
                                    {
                                        $project: {
                                            content: 1
                                        }
                                    }
                                ],
                                as: 'comments'
                            }
                        },
                        // Join với membertasks collection
                        {
                            $lookup: {
                                // from: 'users',
                                from: 'membertasks',
                                localField: 'assigned_to_id',
                                foreignField: '_id',
                                pipeline: [
                                    {
                                        $match: {
                                            is_active: true
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: 'users', // Assuming the 'users' collection has the desired data
                                            localField: 'memberId',
                                            foreignField: '_id',
                                            as: 'userInfo'
                                        }
                                    },
                                    {
                                        $project: {
                                            'userInfo.email': 1,
                                            'userInfo._id': 1,
                                            'userInfo.image': 1,
                                            'userInfo.displayName': 1
                                        }
                                    }
                                ],
                                as: 'assigneds'
                            }
                        }
                    ],
                    as: 'tasks'
                }
            },
            // Thêm các thông tin thống kê (optional)
            {
                $addFields: {
                    totalTasks: { $size: '$tasks' },
                    totalLists: { $size: '$lists' }
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
///
const getAllByMemberId = async (memberId) => {
    try {
        const projects = await Project.find({ membersId: memberId, isActive: true })
        return projects
    } catch (error) {
        throw new Error(error.message)
    }
}

const updateProjectById = async (projectId, reqBody) => {
    try {
        const project = await Project.findById(projectId)
        if (!project) {
            throw new Error('Project not found')
        }

        Object.assign(project, reqBody)
        const updatedProject = await project.save()
        return updatedProject
    } catch (error) {
        throw new Error(`Failed to update project: ${error.message}`)
    }
}
module.exports = { createNew, getDetails, getAllByOwnerId, getAllByMemberId, updateProjectById }