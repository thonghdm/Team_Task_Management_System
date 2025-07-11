const slugify = require('~/utils/formattersSlugify')
const Project = require('~/models/ProjectSchema')
const ProjectRole = require('~/models/ProjectRoleSchema')
const mongoose = require('mongoose')
const _ = require('lodash')
const Task = require('~/models/TaskSchema')
const List = require('~/models/ListSchema')

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
            isRole: 'ProjectManager'
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
            // {
            //     $lookup: {
            //         from: 'lists',
            //         localField: '_id',
            //         foreignField: 'project_id',
            //         as: 'lists'
            //     }
            // },
            {
                $lookup: {
                    from: 'lists',
                    let: { projectId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$project_id', '$$projectId']
                                },
                                is_active: true
                            }
                        }
                    ],
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
                                            'userInfo.displayName': 1,
                                            'userInfo.username': 1,
                                            'userInfo.is_active': 1
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
            {
                $lookup: {
                    from: 'auditlogs',
                    localField: 'audit_log_id',
                    foreignField: '_id',
                    as: 'audit_logs',
                    pipeline: [
                        // Join với bảng users
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'user_id',
                                foreignField: '_id',
                                as: 'user_details'
                            }
                        },
                        {
                            $unwind: { path: '$user_details', preserveNullAndEmptyArrays: true }
                        },
                        // Join với bảng tasks
                        {
                            $lookup: {
                                from: 'tasks',
                                localField: 'task_id', // Trường task_id trong auditlogs
                                foreignField: '_id', // Khóa ngoại _id trong tasks
                                as: 'task_details'
                            }
                        },
                        {
                            $unwind: { path: '$task_details', preserveNullAndEmptyArrays: true }
                        },
                        // Join với bảng lists
                        {
                            $lookup: {
                                from: 'lists',
                                localField: 'list_id', // Trường list_id trong auditlogs
                                foreignField: '_id', // Khóa ngoại _id trong lists
                                as: 'list_details'
                            }
                        },
                        {
                            $unwind: { path: '$list_details', preserveNullAndEmptyArrays: true }
                        },
                        {
                            $project: {
                                task_id: 1,
                                list_id: 1,
                                action: 1,
                                entity: 1,
                                createdAt: 1,
                                old_value: 1,
                                'user_details._id': 1,
                                'user_details.displayName': 1,
                                'user_details.email': 1,
                                'user_details.image': 1,
                                'task_details.task_name': 1, // Thêm task_name từ bảng tasks
                                'list_details.list_name': 1  // Thêm list_name từ bảng lists
                            }
                        }
                    ]
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

const getAllProjects = async () => {
    try {
        const projects = await Project.find() // Fetch all projects
            .populate('ownerId', 'displayName image createdAt') // Populate ownerId field
            .populate({
                path: 'listId',
                select: 'task_id createdAt is_active',
                populate: {
                    path: 'task_id',
                    select: 'name createdAt', // Adjust the fields you want to populate from task_id
                }
            })
        return projects
    } catch (error) {
        throw new Error('Error fetching projects: ' + error.message)
    }
}

const moveTaskDiffList = async (reqBody) => {
    try {
        // xoa list cu
        await List.findByIdAndUpdate(
            reqBody.prevListId,
            {
                $pull: { task_id: reqBody.prevTasks }
            },
            { new: true }
        )
        //update list moi
        const update = await List.findByIdAndUpdate(
            reqBody.nextListId,
            {
                $set: { task_id: reqBody.nextTasks }
            },
            { new: true }
        )

        //update task
        await Task.findByIdAndUpdate(
            reqBody.currentTaskId,
            { $set: { list_id: reqBody.nextListId } },
            { new: true }
        )

        return update
    }
    catch (error) {
        throw new Error('Error fetching projects: ' + error.message)
    }
}

module.exports = { createNew, getDetails, getAllByOwnerId, getAllByMemberId, updateProjectById, getAllProjects, moveTaskDiffList }