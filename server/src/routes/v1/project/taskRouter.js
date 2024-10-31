
const taskController = require('~/controllers/project/taskController')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

Router.route('/by-owner')
    .post(verifyToken, taskController.createNew)

Router.route('/tasks/:taskId')
    .get(taskController.getTaskById)

Router.route('/members')
    .post(taskController.addMember)

module.exports = Router