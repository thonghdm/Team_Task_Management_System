// socketManager.js
const notificationSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`)
        socket.on('join', (userId) => {
            socket.join(userId)
            console.log(`User ${userId} joined their personal room`)
        })
        socket.on('disconnect', () => {
            console.log('User disconnected')
        })
    })

    // Make io available globally for services to use
    return io
}

module.exports = notificationSocket