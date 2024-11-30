
const projectController = require('~/controllers/project/projectController')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

// Route to get all projects by ownerId
Router.route('/by-owner')
    .get(verifyToken, projectController.getAllByOwnerId)
    .post(verifyToken, projectController.createNew)

Router.route('/by-member')
    .get(verifyToken, projectController.getAllByMemberId)

Router.route('/all-projects')
    .get( projectController.getAllProjects)

Router.route('/:id')
    .get(verifyToken, projectController.getDetails)
    .put(verifyToken, projectController.updateProjectById)



module.exports = Router