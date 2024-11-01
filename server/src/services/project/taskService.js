const List = require('~/models/ListSchema')
const Task = require('~/models/TaskSchema')
const MemberTask = require('~/models/MemberTaskSchema')
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
                select: 'email _id image displayName'
            })
        return task
    } catch (error) {
        throw new Error(`Error fetching task: ${error.message}`)
    }
}

const addMemberToTask = async (reqBody) => {
    try {
        // 1. Kiểm tra task có tồn tại không và lấy thông tin task
        const existingTask = await Task.findById(reqBody.task_id)
        if (!existingTask) {
            throw new Error('Task not found')
        }

        // 2. Kiểm tra memberId đã tồn tại trong assigned_to_id chưa
        if (existingTask.assigned_to_id.includes(reqBody.memberId)) {
            throw new Error('Member already exists in this task')

        }

        // 3. Kiểm tra user_invite và memberId có khác nhau không
        if (reqBody.user_invite.toString() === reqBody.memberId.toString()) {
            throw new Error('User cannot invite themselves')
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
            { $addToSet: { assigned_to_id: reqBody.memberId } },
            { new: true }
        )

        return memberTaskResult
    } catch (error) {
        if (error.message === 'Task not found' || error.message === 'User cannot invite themselves') {
            throw new Error(error.message)
        }
        throw new Error(`Error adding member to task: ${error.message}`)
    }
}


module.exports = { createNew, getTaskById, addMemberToTask }