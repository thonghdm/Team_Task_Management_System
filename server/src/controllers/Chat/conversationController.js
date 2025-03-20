const conservationService = require('~/services/chat/conversationService')

const conversationService = {
    getConversationList: async (req, res) => {
        try {
            const userId = req.user.id;
            const conversations = await conservationService.getConversationList(userId);
            res.status(200).json(conversations);
        }
        catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    getConversationMessages: async (req, res) => {
        try {
            const { conversationId } = req.params
            const { page, limit } = req.query
            const messages = await conservationService.getConversationMessages(conversationId, page, limit)
            res.status(200).json(messages)
        }
        catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    createGroupConversation: async (req, res) => {
        try {
            const { groupName, participantIds } = req.body
            const creatorId = req.user.id
            const conversation = await conservationService.createGroupConversation(groupName, participantIds, creatorId)
            res.status(201).json(conversation)
        }
        catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    markConversationAsRead: async (req, res) => {
        try {
            const { conversationId } = req.params
            const userId = req.user.id
            await conservationService.markConversationAsRead(conversationId, userId)
            res.json({ message: 'Conversation marked as read' });
        }
        catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

module.exports = conversationService