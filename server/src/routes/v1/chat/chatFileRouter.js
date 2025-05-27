const express = require('express')
const router = express.Router()
const chatFileController = require('~/controllers/Chat/chatFileController')
const { uploadChatFileChat } = require('~/middlewares/uploadFile')
const verifyToken = require('~/middlewares/verifyToken')

router.route('/upload')
    .post(verifyToken, uploadChatFileChat, chatFileController.uploadChatFile)

router.route('/:conversationId/files')
    .get(verifyToken, chatFileController.getFilesByConversationId)

module.exports = router 