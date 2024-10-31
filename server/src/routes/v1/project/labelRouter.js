const labelController = require('~/controllers/project/labelController')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

Router.route('/labels')
    .post(labelController.createLabel)

module.exports = Router