const express = require('express')
const router = express.Router()
const conversationController = require('~/controllers/Chat/conversationController')
const verifyToken = require('~/middlewares/verifyToken')

router.get('/list', verifyToken, conversationController.getConversationList);
router.get('/:conversationId/messages', verifyToken, conversationController.getConversationMessages);
router.post('/group', verifyToken, conversationController.createGroupConversation);
router.post('/:conversationId/read', verifyToken, conversationController.markConversationAsRead);
router.get('/find', verifyToken, conversationController.getConversation);
router.post('/create', verifyToken, conversationController.createConversation);

module.exports = router;