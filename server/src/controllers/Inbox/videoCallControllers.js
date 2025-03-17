const videoCallService = require('~/services/inbox/videoCallServices')
const agoraTokenService = require('~/services/inbox/agoraTokenService')

const videoCallController = {
    /**
     * Bắt đầu cuộc gọi nhóm
     */
    startGroupCall: async (req, res, next) => {
        try {
            const { groupId, participantIds } = req.body
            if (!req.currentUser || !req.currentUser._id) {
                return res.status(401).json({
                    err: 3,
                    msg: 'User not authenticated'
                })
            }
            const videoCall = await videoCallService.createVideoCall(
                req.currentUser._id,
                participantIds,
                groupId
            )
            res.status(201).json({
                success: true,
                videoCall,
                agoraData: generateAgoraToken(videoCall._id, req.currentUser._id)
            });
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    details: error.message
                })
            }
            next(error)
        }
    },

    /**
     * Chấp nhận cuộc gọi
     */
    acceptCall: async (req, res, next) => {
        try {
            const { callId } = req.params
            const call = await videoCallService.acceptCall(callId, req.currentUser._id)

            res.status(200).json({
                success: true,
                call,
                agoraData: generateAgoraToken(call._id, req.currentUser._id)
            })
        } catch (error) {
            next(error)
        }
    },

    /**
     * Từ chối cuộc gọi
     */
    declineCall: async (req, res, next) => {
        try {
            const { callId } = req.params
            const call = await videoCallService.declineCall(callId, req.currentUser._id)

            res.status(200).json({ success: true, call })
        } catch (error) {
            next(error)
        }
    },

    /**
     * Kết thúc cuộc gọi
     */
    endCall: async (req, res, next) => {
        try {
            const { callId } = req.params
            const call = await videoCallService.endCall(callId, req.currentUser._id)

            res.status(200).json({ success: true, call })
        } catch (error) {
            next(error)
        }
    },

    /**
     * Lấy lịch sử cuộc gọi
     */
    getCallHistory: async (req, res, next) => {
        try {
            console.log(req.currentUser._id)
            const calls = await videoCallService.getCallHistory(req.currentUser._id)

            res.status(200).json({
                success: true,
                count: calls.length,
                calls
            })
        } catch (error) {
            next(error)
        }
    },

    /**
     * Lấy cuộc gọi đang hoạt động
     */
    getActiveCall: async (req, res, next) => {
        try {
            const activeCall = await videoCallService.getActiveCall(req.currentUser._id)

            res.status(200).json({
                success: true,
                call: activeCall,
                agoraData: generateAgoraToken(activeCall._id, req.currentUser._id)
            })
        } catch (error) {
            if (error.message === 'No active call found') {
                return res.status(404).json({ success: false, message: error.message })
            }
            next(error)
        }
    },

    /**
     * Lấy thông tin cuộc gọi theo ID
     */
    getCallById: async (req, res, next) => {
        try {
            const { callId } = req.params
            console.log(req.currentUser._id)
            if (!req.currentUser || !req.currentUser._id) {
                return res.status(401).json({
                    err: 3,
                    msg: 'User not authenticated'
                })
            }
            const call = await videoCallService.getCallById(callId, req.currentUser._id)

            res.status(200).json({
                success: true,
                call,
                agoraData: generateAgoraToken(callId, req.currentUser._id)
            })
        } catch (error) {
            if (error.message === 'Call not found') {
                return res.status(404).json({ success: false, message: error.message })
            }
            if (error.message === 'You are not authorized to view this call') {
                return res.status(403).json({ success: false, message: error.message })
            }
            next(error)
        }
    }
}

// Hàm tạo token Agora
// Hàm tạo token Agora
const generateAgoraToken = (callId, userId) => {
    console.log('Generating Agora token for callId:', callId, 'userId:', userId);
    return {
        channelName: callId.toString(),
        token: agoraTokenService.generateToken(callId.toString(), userId, 1, 3600),
        uid: userId
    }
}

module.exports = videoCallController
