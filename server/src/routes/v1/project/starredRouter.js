const starredController = require('~/controllers/project/starredController')
const verifyToken = require('~/middlewares/verifyToken')

const Router = require('express').Router()


Router.route('/starred-project')
    .post(verifyToken, starredController.createNew)
    .put(verifyToken, starredController.updateStarred)

Router.route('/starred-project/:userId')
    .get(verifyToken, starredController.getAllByUser)

// Router.route('/starred-project/:id')
//     .put(verifyToken, starredController.updateStarred)

module.exports = Router
