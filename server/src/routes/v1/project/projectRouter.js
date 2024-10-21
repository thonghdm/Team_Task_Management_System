
const projectController = require('~/controllers/project/projectController')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

// Route to get all projects by ownerId
Router.route('/projects/by-owner')
    .get(projectController.getAllByOwnerId)
    .post(verifyToken, projectController.createNew)

Router.route('/:id')
    .get(projectController.getDetails)
    .put()

Router.route('/projects/by-member')
    .get(projectController.getAllByMemberId)


module.exports = Router