
const taskController = require('~/controllers/project/taskController')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

// Route to get all projects by ownerId
Router.route('/by-owner')
    .post( taskController.createNew)

module.exports = Router