const express = require('express')
const router = express.Router()
const videoCallController = require('~/controllers/Inbox/videoCallControllers')
const verifyToken = require('~/middlewares/verifyToken')

// Áp dụng middleware xác thực cho tất cả các routes
router.use(verifyToken)

// Start a new video call
router.post('/', videoCallController.startGroupCall)

// Accept a video call
router.put('/:callId/accept', videoCallController.acceptCall)

// Decline a video call
router.put('/:callId/decline', videoCallController.declineCall)

// End a video call
router.put('/:callId/end', videoCallController.endCall)

// Get call history
router.get('/history', videoCallController.getCallHistory)

// Get active call for current user
router.get('/active', videoCallController.getActiveCall)

// Get call details by ID
router.get('/:callId', videoCallController.getCallById)

module.exports = router