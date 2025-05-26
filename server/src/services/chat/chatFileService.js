const Message = require('~/models/MessageSchema')
const Conversation = require('~/models/ConversationSchema')
const { generateChatFileUrl } = require('~/utils/generateFileUrl')

const chatFileService = {
    createFileMessage: async (fileData, io = null) => {
        try {
            console.log('Creating file message with data:', fileData);
            
            // Validate conversation exists
            const conversation = await Conversation.findById(fileData.conversationId)
            if (!conversation) {
                throw new Error('Conversation not found!')
            }

            // Create file message with proper URL
            const message = new Message({
                messageType: 'file',
                file: JSON.stringify({
                    originalName: fileData.originalName,
                    fileName: fileData.fileName,
                    url: generateChatFileUrl(fileData.fileName),
                    mimeType: fileData.mimeType,
                    size: fileData.size
                }),
                sender: fileData.uploadedBy,
                conversation: fileData.conversationId,
                seenBy: [{ user: fileData.uploadedBy }]
            })

            await message.save()
            console.log('File message saved:', message._id);

            // Update conversation's lastMessage
            conversation.lastMessage = message._id
            conversation.unreadCounts.forEach(unreadCount => {
                if (unreadCount.user.toString() !== fileData.uploadedBy.toString()) {
                    unreadCount.count++
                }
            })
            await conversation.save()

            // Populate sender info before returning
            const populatedMessage = await Message.findById(message._id).populate('sender', 'displayName image')
            console.log('Returning populated message:', populatedMessage);
            
            return populatedMessage
        } catch (error) {
            console.error('Error in createFileMessage:', error);
            throw error
        }
    },

    getFilesByConversationId: async (conversationId) => {
        try {
            const fileMessages = await Message.find({
                conversation: conversationId,
                messageType: 'file'
            }).populate('sender', 'displayName image').sort({ createdAt: -1 })

            return fileMessages.map(msg => ({
                _id: msg._id,
                ...JSON.parse(msg.file),
                sender: msg.sender,
                createdAt: msg.createdAt
            }))
        } catch (error) {
            throw error
        }
    }
}

module.exports = chatFileService 