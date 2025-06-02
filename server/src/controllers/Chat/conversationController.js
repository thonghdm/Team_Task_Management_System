const conservationService = require('~/services/chat/conversationService')

const conversationService = {
    getConversationList: async (req, res) => {
        try {
            console.log('DEBUG /conversations/list req.user:', req.currentUser);
            const userId = req.currentUser._id;
            const conversations = await conservationService.getConversationList(userId);
            res.status(200).json(conversations);
        }
        catch (error) {
            console.error('getConversationList error:', error);
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
            const creatorId = req.currentUser._id
            const conversation = await conservationService.createGroupConversation(groupName, participantIds, creatorId)
            if (!conversation) {
                return res.status(400).json({ error: 'Failed to create group conversation' })
            }
            res.status(201).json(conversation)
        }
        catch (error) {
            console.error('createGroupConversation error:', error)
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
    },
    getConversation: async (req, res) => {
        try {
            const { userId, otherUserId } = req.query;
            const conversation = await conservationService.findConversationBetweenUsers(userId, otherUserId);
            if (!conversation) {
                return res.status(404).json({ message: 'Conversation not found' });
            }
            res.status(200).json(conversation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createConversation: async (req, res) => {
        try {
            const { userId, otherUserId } = req.body;
            const conversation = await conservationService.createConversationBetweenUsers(userId, otherUserId);
            res.status(201).json(conversation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = conversationService