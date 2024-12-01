
const listController = require('~/controllers/project/listController')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

Router.route('/by-owner')
    .post(verifyToken, listController.createNew)

Router.route('/lists/:listId')
    .put(listController.updateListById)

module.exports = Router