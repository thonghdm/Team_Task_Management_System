const projectRoleController = require('~/controllers/project/projectRoleController')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

// Route to create a new project role
Router.route('/member')
    .post(verifyToken, projectRoleController.createNewRole)
    .put(verifyToken, projectRoleController.deleteMemberProject)

// Route to update a project role
Router.route('/member/:id')
    .get(verifyToken, projectRoleController.getAllMemberIdProject)
    .put(verifyToken, projectRoleController.updateRole)

Router.route('/admin')
    .put(verifyToken, projectRoleController.leaveAdminProject)
module.exports = Router
