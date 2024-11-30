
const memberTaskController = require('~/controllers/project/memberTaskController')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

Router.route('/delete-member')
    .put(verifyToken, memberTaskController.updateMember)

Router.route('/tasks/:memberId')
    .get(verifyToken, memberTaskController.getMemberTasks )

module.exports = Router