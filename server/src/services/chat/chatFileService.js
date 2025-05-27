const Message = require('~/models/MessageSchema')
const Conversation = require('~/models/ConversationSchema')

const chatFileService = {
    createFileMessage: async (fileData, io = null) => {
        try {
            console.log('Creating file message with data:', fileData);
            
            // Validate conversation exists
            const conversation = await Conversation.findById(fileData.conversationId)
            if (!conversation) {
                throw new Error('Conversation not found!')
            }

            // Create file message with proper URL and original name
            const message = new Message({
                messageType: 'file',
                file: JSON.stringify({
                    originalName: fileData.originalName, // Keep original file name
                    fileName: fileData.fileName,
                    url: fileData.url, // Use the Google Cloud Storage URL directly
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

            return fileMessages.map(msg => {
                const fileData = JSON.parse(msg.file);
                return {
                    _id: msg._id,
                    originalName: fileData.originalName, // Keep original file name
                    fileName: fileData.fileName,
                    url: fileData.url,
                    mimeType: fileData.mimeType,
                    size: fileData.size,
                    sender: msg.sender,
                    createdAt: msg.createdAt
                }
            });
        } catch (error) {
            throw error
        }
    },

    getMessageById: async (messageId) => {
        try {
            console.log('Getting message by ID:', messageId);
            const message = await Message.findById(messageId);
            if (!message) {
                throw new Error('Message not found');
            }
            return message;
        } catch (error) {
            console.error('Error in getMessageById:', error);
            throw error;
        }
    }
}

module.exports = chatFileService 