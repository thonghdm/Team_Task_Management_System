
const listController = require('~/controllers/project/listController')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

Router.route('/by-owner')
    .post(verifyToken, listController.createNew)

module.exports = Router