const subscriptionController = require('~/controllers/project/subscriptionController')
const verifyToken = require('~/middlewares/verifyToken')

const Router = require('express').Router()

Router.route('/add-free')
    .post(subscriptionController.createNew)
Router.route('/get-subscription/:userId')
    .get(subscriptionController.getAllByUser)

Router.route('/user-bills/:userId')
    .get(subscriptionController.getUserBills)

Router.route('/user-bills')
    .get(subscriptionController.getAllBills)


module.exports = Router
