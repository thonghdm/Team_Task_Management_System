const express = require('express')
const notificationController = require('~/controllers/project/notificationController.js')

const router = express.Router()

router.get('/user/:userId', notificationController.getNotifications)
router.post('/create', notificationController.addNotification)

// Mark a notification as read
router.put('/:notificationId/read', notificationController.markAsRead)
// Mark all notifications as read for a user
router.put('/read-all/:userId', notificationController.markAllAsRead)

module.exports = router
