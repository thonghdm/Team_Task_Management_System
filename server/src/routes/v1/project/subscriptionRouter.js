const subscriptionController = require('~/controllers/project/subscriptionController')
const verifyToken = require('~/middlewares/verifyToken')

const Router = require('express').Router()

Router.route('/add-free')
    .post(verifyToken, subscriptionController.createNew)
Router.route('/get-subscription/:userId')
    .get(verifyToken, subscriptionController.getAllByUser)

Router.route('/user-bills/:userId')
    .get(verifyToken, subscriptionController.getUserBills)

Router.route('/user-bills')
    .get(verifyToken, subscriptionController.getAllBills)


module.exports = Router
