const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema(
    {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true },
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
        type: { 
            type: String, 
            required: true,
            enum: ['add_to_room', 'new_message', 'project_update', 'deadline_reminder', 'mention', 'task_invite']
        },
        isRead: { type: Boolean, default: false }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Notification', NotificationSchema)
