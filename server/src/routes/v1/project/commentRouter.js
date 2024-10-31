const commentController = require('~/controllers/project/commentController')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

Router.route('/comments')
    .post(commentController.createComment)

Router.route('/comments/:id')
    .get(commentController.getComment)
module.exports = Router