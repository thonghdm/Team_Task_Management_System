const taskService = require('~/services/project/taskService')
const { StatusCodes } = require('http-status-codes')
// const mongoose = require('mongoose')
const taskController = {
    createNew: async (req, res, next) => {
        try {
            const createTask = await taskService.createNew(req.body)
            res.status(StatusCodes.CREATED).json({
                message: 'Task created successfully!',
                task: createTask
            })
        } catch (error) {
            next(error)
        }
    },
    getTaskById: async (req, res, next) => {
        const { taskId } = req.params
        try {
            const task = await taskService.getTaskById(taskId)
            if (!task) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: 'Task not found' })
            }
            res.status(StatusCodes.OK).json(task)
        } catch (error) {
            next(error)
        }
    },
    addMember: async (req, res, next) => {
        try {
            const createdMember = await taskService.addMemberToTask(req.body)
            res.status(StatusCodes.OK).json({
                message: 'Member added to task successfully',
                member: createdMember
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = taskController