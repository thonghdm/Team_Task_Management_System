const Notification = require('~/models/NotificationSchema')

const getUserNotifications = async (userId) => {
    if (!userId) return []
    return await await Notification.find({ receiverId: userId })
        .sort({ createdAt: -1 })
        .populate('senderId', 'username avatar')
        .populate('projectId', 'projectName')
        .limit(50)
}

const createNotification = async (senderId, receiverId, projectId, message, type = 'add_to_room', io) => {
    if (!senderId || !receiverId || !message || !projectId) {
        throw new Error('Missing required fields')
    }
    try {
        const notification = new Notification({
            senderId,
            receiverId,
            projectId,
            message,
            type,
            read: false,
            createdAt: new Date()
        })
        await notification.save()
        if (io) {
            io.to(receiverId.toString()).emit('newNotification', {
                notification,
                type: 'add_to_room'
            })
        }
        return notification
    } catch (error) {
        throw new Error(`Error creating notification: ${error.message}`)
    }
}


const markNotificationAsRead = async (id) => {
    if (!id) return null
    return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true })
}

const markAllNotificationsAsRead = async (id) => {
    if (!id) return null
    return await await Notification.updateMany(
        { receiverId: id, isRead: false },
        { isRead: true }
    )
}

module.exports = {
    getUserNotifications,
    createNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead
}
