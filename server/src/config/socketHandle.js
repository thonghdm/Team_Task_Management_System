const conversationService = require('~/services/chat/conversationService')
const Conversation = require('~/models/ConversationSchema')
const socketHandler = (io) => {
    const userSockets = new Map()
    io.on('connection', (socket) => {
        console.log('New user connected')

        socket.on('authenticate', (userId) => {
            userSockets.set(userId, socket.id)
            socket.join(userId)
            console.log(`User ${userId} authenticated`)
        })

        socket.on('join conversation', (conversationId) => {
            socket.join(conversationId._id)
            console.log(`User joined conversationnnn ${conversationId}`)
        })

        socket.on('leave conversation', (conversationId) => {
            socket.leave(conversationId._id)
            console.log(`User left conversation ${conversationId}`)
        })

        socket.on('send message', async ({ senderId, conversationId, messageData }) => {
            try {
                const message = await conversationService.sendMessage(senderId, conversationId, messageData)
                io.to(conversationId).emit('new message', message)
                const conversation = await Conversation.findById(conversationId).populate('participants', 'displayName image')
                conversation.participants.forEach(participant => {
                    if (participant._id.toString() !== senderId.toString()) {
                        const socketId = userSockets.get(participant._id.toString())
                        if (socketId) {
                            io.to(socketId).emit('conversation updated', conversation)
                        }
                    }})
            } catch (error) {
                console.error('Error sending message:', error.message)
                socket.emit('messageSent', { status: 'error', message: error.message })
            }
        })

        socket.on('mark message as seen', async ({messageId, userId}) => {
            try {
                const message = await conversationService.markMessageAsSeen(messageId, userId)
                io.to(message.conversation.toString()).emit('message seen', { messageId, userId })
            } catch (error) {
                console.error('Error marking message as seen:', error)
            }
        })

        socket.on('disconnect', () => {
            userSockets.forEach((value, key) => {
                if (value === socket.id) {
                    userSockets.delete(key)
                }
            })
            console.log('A user disconnected')
        })
    })
}

module.exports = socketHandler