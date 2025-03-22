const callHandlers = require('./callHandlers')
const User = require('~/models/user') // Mongoose user model

let io
let onlineUsers = new Map()

module.exports = (socketIo) => {
    io = socketIo

    io.on('connection', async (socket) => {
        // console.log(`User connected: ${socket.id}`)

        /**
         * Xác thực người dùng khi kết nối socket
         */
        socket.on('authenticate', async (data) => {
            try {
                const { userId } = data
                if (userId) {
                    // Cập nhật trạng thái online trong DB
                    await User.findByIdAndUpdate(userId, { isOnline: true })

                    // Gán userId vào socket và lưu vào Map
                    socket.userId = userId
                    onlineUsers.set(userId, socket.id)
                    // console.log(`User ${userId} authenticated with socket ${socket.id}`)

                    // Tham gia vào room cá nhân để nhận thông báo
                    socket.join(userId)
                    socket.emit('authenticated', { success: true });

                    // Phát sự kiện trạng thái online
                    // socket.broadcast.emit('user_status_changed', { userId, isOnline: true })
                }
            } catch (error) {
                console.error('Authentication error:', error)
                socket.emit('authenticated', { success: false, error: 'No userId provided' });
            }
        })

        // Handle ping events (keep-alive)
        socket.on('ping', (data) => {
            if (data.userId) {
                // Update the socket mapping if needed
                if (onlineUsers.get(data.userId) !== socket.id) {
                    console.log(`Updating socket for user ${data.userId}: ${socket.id}`);
                    onlineUsers.set(data.userId, socket.id);
                }

                // Send a pong to confirm connection
                socket.emit('pong', { timestamp: Date.now() });
            }
        });
        /**
         * Xử lý gọi điện video (callHandlers)
         */
        callHandlers(io, socket, onlineUsers)

        /**
         * Người dùng tham gia phòng cá nhân (nhận thông báo)
         */
        socket.on('join', (userId) => {
            socket.join(userId)
            console.log(`User ${userId} joined their personal room`)
        })

        /**
         * Xử lý khi người dùng ngắt kết nối
         */
        socket.on('disconnect', async () => {
            if (socket.userId) {
                // Cập nhật trạng thái offline trong DB
                await User.findByIdAndUpdate(socket.userId, { isOnline: false })
                console.log(`User ${socket.userId} disconnected`)
                // Xóa khỏi danh sách online
                onlineUsers.delete(socket.userId)
                // Phát sự kiện trạng thái offline
                io.emit('user_status_changed', { userId: socket.userId, isOnline: false })
            }
        })
        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
    })

    return io
}

// Helper để lấy socket của user
exports.getUserSocket = (userId) => {
    const socketId = onlineUsers.get(userId)
    return socketId ? io.sockets.sockets.get(socketId) : null
}

// Helper để lấy danh sách user đang online
exports.getOnlineUsers = () => {
    return Array.from(onlineUsers.keys())
}

// Helper để gửi event cho user
exports.emitToUser = (userId, event, data) => {
    const socketId = onlineUsers.get(userId)
    if (socketId) {
        io.to(socketId).emit(event, data)
        return true
    }
    return false
}


// // socketManager.js
// const notificationSocket = (io) => {
//     io.on('connection', (socket) => {
//         console.log(`User connected: ${socket.id}`)
//         socket.on('join', (userId) => {
//             socket.join(userId)
//             console.log(`User ${userId} joined their personal room`)
//         })
//         socket.on('disconnect', () => {
//             console.log('User disconnected')
//         })
//     })

//     // Make io available globally for services to use
//     return io
// }

// module.exports = notificationSocket