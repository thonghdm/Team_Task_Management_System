const express = require('express')
const router = express.Router()
const groupController = require('~/controllers/Chat/groupController')
const verifyToken = require('~/middlewares/verifyToken')

router.post('/create', verifyToken, groupController.createGroup)
router.post('/add-member', verifyToken, groupController.addMemberToGroup)
router.post('/remove-member', verifyToken, groupController.removeMemberFromGroup)
router.post('/make-admin', verifyToken, groupController.makeGroupAdmin)
router.post('/remove-admin', verifyToken, groupController.removeGroupAdmin)
router.post('/update-avatar', verifyToken, groupController.updateGroupAvatar)

module.exports = router