const subscriptionPlanController = require('~/controllers/project/subscriptionPlanController')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()


Router.route('/all-plans')
    .get(verifyToken, subscriptionPlanController.getAllPlans)

module.exports = Router