const List = require('~/models/ListSchema')
const Task = require('~/models/TaskSchema')
const MemberTask = require('~/models/MemberTaskSchema')
import sendEmail from '~/utils/sendEmail'
const createNew = async (reqBody) => {
    try {
        const newTaskData = {
            ...reqBody
        }
        const newTask = new Task(newTaskData)
        const createdTask = await newTask.save()

        const getNewTask = await Task.findById(createdTask._id)
        if (getNewTask) {
            await addTaskToList(getNewTask)
        }
        return getNewTask
    } catch (error) {
        throw new Error(error)
    }
}

const addTaskToList = async (task) => {
    try {
        const updatedDocument = await List.findOneAndUpdate(
            { _id: task.list_id },
            { $push: { task_id: task._id } },
            { returnDocument: 'after' }
        )
        return updatedDocument
    } catch (error) {
        throw new Error(`Error adding list to project: ${error.message}`)
    }
}

const getTaskById = async (taskId) => {
    try {
        const task = await Task.findById(taskId)
            .populate({
                path: 'label_id',
                match: { is_active: true },
                select: 'name color createdAt'
            })
            .populate({
                path: 'project_id',
                select: 'projectName'
            })
            .populate({
                path: 'comment_id',
                match: { is_active: true },
                select: 'content user_id createdAt',
                populate: {
                    path: 'user_id',
                    select: 'email _id image displayName'
                }
            })
            .populate({
                path: 'assigned_to_id',
                match: { is_active: true },
                // select: 'email _id image displayName'
                select: 'memberId _id user_invite createdAt',
                populate: {
                    path: 'memberId',
                    select: 'email _id image displayName'
                }
            })
            .populate({
                path: 'audit_log_id',
                match: { is_active: true },
                select: 'action user_id entity createdAt old_value new_value',
                populate: {
                    path: 'user_id',
                    select: 'email _id image displayName'
                }
            })
        return task
    } catch (error) {
        throw new Error(`Error fetching task: ${error.message}`)
    }
}

const addMemberToTask = async (reqBodyArray) => {
    try {
        // Đảm bảo input là array
        if (!Array.isArray(reqBodyArray)) {
            throw new Error('Input must be an array')
        }

        const results = []

        // Xử lý từng member một
        for (const reqBody of reqBodyArray) {
            // 1. Kiểm tra task có tồn tại không và lấy thông tin task
            const existingTask = await Task.findById(reqBody.task_id)
            if (!existingTask) {
                throw new Error(`Task not found with id: ${reqBody.task_id}`)
            }

            // 2. Kiểm tra memberId đã tồn tại trong assigned_to_id chưa
            if (existingTask.assigned_to_id.includes(reqBody.memberId)) {
                throw new Error(`Member ${reqBody.memberId} already exists in this task`)
            }

            // 4. Kiểm tra member đã tồn tại trong MemberTask chưa
            const existingMemberTask = await MemberTask.findOne({
                task_id: reqBody.task_id,
                memberId: reqBody.memberId
            })

            let memberTaskResult

            if (existingMemberTask) {
                // Nếu đã tồn tại thì update is_active = true
                memberTaskResult = await MemberTask.findByIdAndUpdate(
                    existingMemberTask._id,
                    {
                        is_active: true,
                        updatedAt: new Date()
                    },
                    { new: true }
                )
            } else {
                // Nếu chưa tồn tại thì tạo mới
                const newMemberData = {
                    memberId: reqBody.memberId,
                    task_id: reqBody.task_id,
                    user_invite: reqBody.user_invite,
                    is_active: true
                }
                const newMemberTask = new MemberTask(newMemberData)
                memberTaskResult = await newMemberTask.save()
            }

            // 5. Update assigned_to_id trong Task
            await Task.findByIdAndUpdate(
                reqBody.task_id,
                // { $addToSet: { assigned_to_id: reqBody.memberId } },
                { $addToSet: { assigned_to_id: memberTaskResult._id } },
                { new: true }
            )
            results.push(memberTaskResult)
            await sendEmail({
                email: reqBody.user_email,
                subject: 'Notification from DTPROJECT',
                message: `User ${reqBody.user_name_invite} has assigned you the task  ${existingTask.task_name}`
            })

        }

        // Trả về array kết quả
        return {
            message: 'Members added to task successfully',
            members: results
        }

    } catch (error) {
        // Xử lý lỗi specific
        if (error.message.includes('Task not found') ||
            error.message.includes('User cannot invite themselves') ||
            error.message.includes('already exists')) {
            throw new Error(error.message)
        }
        // Xử lý lỗi chung
        throw new Error(`Error adding members to task: ${error.message}`)
    }
}

// // Sử dụng với MongoDB transaction để đảm bảo tính atomic
// const addMembersToTaskWithTransaction = async (reqBodyArray) => {
//     const session = await mongoose.startSession()
//     try {
//         session.startTransaction()

//         const result = await addMemberToTask(reqBodyArray)

//         await session.commitTransaction()
//         return result
//     } catch (error) {
//         await session.abortTransaction()
//         throw error
//     } finally {
//         session.endSession()
//     }
// }

const updateMemberTask = async (memberId, reqBody) => {
    try {
        const existingMemberTask = await MemberTask.findById(memberId)
        if (!existingMemberTask) {
            throw new Error('Member not found')
        }
        Object.assign(existingMemberTask, reqBody)
        const updatedMemberTask = await existingMemberTask.save()
        return updatedMemberTask
    } catch (error) {
        throw new Error(`Failed to update member: ${error.message}`)
    }
}

const updateTaskById = async (taskId, reqBody) => {
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new Error('Task not found')
        }

        if (reqBody.is_active === false) {
            await List.findByIdAndUpdate(
                task.list_id,
                {
                    $pull: { task_id: taskId }
                },
                { new: true }
            )
        }

        Object.assign(task, reqBody)
        const updatedTask = await task.save()
        return updatedTask
    } catch (error) {
        throw new Error(`Failed to update task: ${error.message}`)
    }
}


module.exports = { createNew, getTaskById, addMemberToTask, updateMemberTask, updateTaskById }