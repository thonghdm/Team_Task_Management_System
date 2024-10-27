const projectRoleController = require('~/controllers/project/projectRoleController')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

// Route to create a new project role
Router.route('/member')
    .post(projectRoleController.createNewRole)

// Route to update a project role
Router.route('/member/:id')
    .get(projectRoleController.getAllMemberProject)
    .put(projectRoleController.updateRole)


module.exports = Router
