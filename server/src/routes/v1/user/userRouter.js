const router = require('express').Router()
const userController = require('~/controllers/User/userController')
const verifyToken = require('~/middlewares/verifyToken')
const { upload } = require('~/utils/cloudinary')

router.get('/get-one', verifyToken, userController.getOne)
router.put('/update-user', verifyToken, upload.single('image'), userController.updateUser)

router.route('/search-member')
    .get(userController.searchUsers)

router.route('/all-member')
    .get(userController.getAllMembers)

router.route('/update-all')
    .put(verifyToken, userController.updateAll)

router.route('/change-password')
    .put(userController.changePassword)
router.route('/change-password-profile')
    .put(userController.changePasswordProfile)
module.exports = router