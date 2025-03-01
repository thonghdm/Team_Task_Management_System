import express from 'express'
const verifyToken = require('~/middlewares/verifyToken')
const stripeController = require('~/controllers/project/tripeController.js')

const Router = require('express').Router()

Router.route('/create-checkout-session')
    .post(stripeController.createCheckoutSession)

Router.route('/webhook')
    .post(stripeController.stripeWebhook)

module.exports = Router
