const router = require('express').Router()
const userController = require('~/controllers/User/userController')
const verifyToken = require('~/middlewares/verifyToken')

router.get('/get-one', verifyToken, userController.getOne)


module.exports = router