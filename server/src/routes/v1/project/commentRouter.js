const commentController = require('~/controllers/project/commentController')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

Router.route('/comments')
    .put(verifyToken, commentController.updateComment)
    .post(verifyToken, commentController.createComment)

Router.route('/comments/:id') //id = task_id
    .get(verifyToken, commentController.getComment)

module.exports = Router