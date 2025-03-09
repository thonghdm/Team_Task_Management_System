const Notification = require('~/models/NotificationSchema')

const getUserNotifications = async (userId) => {
    if (!userId) return []
    return await await Notification.find({ receiverId: userId })
        .sort({ createdAt: -1 })
        .populate('senderId', 'username avatar')
        .populate('projectId', 'projectName')
        .limit(50)
}

const createNotification = async (notifications, io) => {
    if (!Array.isArray(notifications) || notifications.length === 0) {
        throw new Error('Notifications must be a non-empty array')
    }

    try {
        // Validate each notification object
        notifications.forEach(notification => {
            const { senderId, receiverId, projectId, message } = notification
            if (!senderId || !receiverId || !message || !projectId) {
                throw new Error('Missing required fields in one of the notifications')
            }
        })

        const notificationDocs = notifications.map(notification => ({
            ...notification,
            read: false,
            createdAt: new Date()
        }))

        // Insert many notifications
        const createdNotifications = await Notification.insertMany(notificationDocs)

        // Emit socket events if io is provided
        if (io) {
            createdNotifications.forEach(notification => {
                io.to(notification.receiverId.toString()).emit('newNotification', {
                    notification,
                    type: notification.type || 'add_to_room'
                })
            })
        }
        return createdNotifications
    } catch (error) {
        throw new Error(`Error creating notifications: ${error.message}`)
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
