
const projectController = require('~/controllers/project/projectController')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

// Route to get all projects by ownerId
Router.route('/by-owner')
    .get( projectController.getAllByOwnerId)
    .post(verifyToken, projectController.createNew)

Router.route('/by-member')
    .get(verifyToken, projectController.getAllByMemberId)

Router.route('/:id')
    .get(projectController.getDetails)
    .put()

module.exports = Router