const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema(
    {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true },
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
        taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
        type: {
            type: String,
            required: true,
            enum: ['add_to_room', 'new_message', 'project_update', 'deadline_reminder', 'project_invite', 'task_invite', 'delete_member', 'change_role', 'leave_project', 'leave_task', 'delete_project', 'delete_task', 'task_update', 'task_deadline', 'task_complete', 'task_incomplete']
        },
        isRead: { type: Boolean, default: false }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Notification', NotificationSchema)
