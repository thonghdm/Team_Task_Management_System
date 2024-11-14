
const taskController = require('~/controllers/project/taskController')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

Router.route('/by-owner')
    .post(verifyToken, taskController.createNew)

Router.route('/tasks/:taskId')
    .get(verifyToken, taskController.getTaskById)
    .put(taskController.updateTaskById)

Router.route('/members')
    .post(verifyToken, taskController.addMember)
    .put(verifyToken, taskController.updateMember)

module.exports = Router