const projectRoleController = require('~/controllers/project/projectRoleController')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

// Route to create a new project role
Router.route('/member')
    .post(verifyToken, projectRoleController.createNewRole)
    .put(projectRoleController.deleteMemberProject)

// Route to update a project role
Router.route('/member/:id')
    .get(projectRoleController.getAllMemberIdProject)
    .put(projectRoleController.updateRole)


module.exports = Router
