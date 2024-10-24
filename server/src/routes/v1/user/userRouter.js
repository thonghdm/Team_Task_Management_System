const router = require('express').Router()
const userController = require('~/controllers/User/userController')
const verifyToken = require('~/middlewares/verifyToken')
const {upload} = require('~/utils/cloudinary')

router.get('/get-one', verifyToken, userController.getOne)
router.put('/update-user', verifyToken, upload.single('image'), userController.updateUser)
module.exports = router