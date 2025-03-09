const notificationService = require('~/services/project/notificationService.js')

const getNotifications = async (req, res) => {
    try {
        if (!req.params.userId)
            return res.status(400).json({ error: 'Missing user ID' })
        const notifications = await notificationService.getUserNotifications(req.params.userId)
        res.status(200).json(notifications)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const addNotification = async (req, res) => {
    try {
        const newNotification = await notificationService.createNotification(
            req.body,
            req.io
        )
        res.status(201).json(newNotification)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


const markAsRead = async (req, res) => {
    try {
        if (!req.params.notificationId )
            return res.status(400).json({ error: 'Missing notification ID' })
        const updatedNotification = await notificationService.markNotificationAsRead(req.params.notificationId)
        res.status(200).json(updatedNotification)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const markAllAsRead = async (req, res) => {
    try {
        if (!req.params.userId)
            return res.status(400).json({ error: 'Missing user ID' })
        const updatedNotifications = await notificationService.markAllNotificationsAsRead(req.params.userId)
        res.status(200).json(updatedNotifications)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    getNotifications,
    addNotification,
    markAsRead,
    markAllAsRead
}
