
const projectController = require('~/controllers/project/projectController')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

// Route to get all projects by ownerId
Router.route('/')
    .get(projectController.getAllByOwnerId)
    .post(projectController.createNew)

Router.route('/:id')
    .get(projectController.getDetails)
    .put()



module.exports = Router