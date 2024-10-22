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
    }

}

module.exports = taskController