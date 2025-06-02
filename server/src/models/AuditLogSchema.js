const mongoose = require('mongoose')

const AuditLogSchema = new mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    list_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List'
    },
    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    action: {
        type: String,
        enum: ['Create', 'Update', 'Delete', 'Add', 'Remove', 'Assign', 'Unassign', 'Leave'],
        required: true
    },
    entity: {
        type: String,
        enum: ['Task', 'Comment', 'Assignee', 'Label', 'Priority', 'Status', 'Start Date',
            'Due Date', 'Attachment', 'Description', 'Member', 'List', 'Task Review', 'Task Name'],
        required: true
    },
    old_value: {
        type: String
    },
    new_value: {
        type: String
    },
    user_id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt : {
        type: Date,
        default: Date.now
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true }
)

const AuditLog = mongoose.model('AuditLog', AuditLogSchema)
module.exports = AuditLog
