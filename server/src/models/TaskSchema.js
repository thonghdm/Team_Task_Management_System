const mongoose = require('mongoose')

const descriptionDefault = '<p>		<strong><em><u>Add new description</u></em></strong></p>'

const TaskSchema = new mongoose.Schema(
    {
        project_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' }, // Ideally, use ObjectId if it's referencing a Project model
        list_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'List' }, // Ideally, use ObjectId if it's referencing a List model
        task_name: { type: String, required: true },
        description: { type: String, default: descriptionDefault },
        img: { type: String },
        checklist: { type: Boolean, default: false },
        status: {
            type: String,
            enum: ['To Do', 'In Progress', 'Completed'],
            default: 'To Do'
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium'
        },
        assigned_to_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MemberTask' }], // Consider using ObjectId if referencing a User model
        created_by_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Consider using ObjectId
        start_date: { type: Date },
        end_date: { type: Date },
        done_date: { type: Date, default: '1000-10-10T00:00:00.000+00:00' },
        is_active: { type: Boolean, default: true },
        comment_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
        attachments_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }],
        label_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Label' }],
        audit_log_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AuditLog' }],
        color: {
            type: String,
            default: '#000000'
        }

    },
    { timestamps: true } // This will add createdAt and updatedAt fields automatically
)

const Task = mongoose.model('Task', TaskSchema)

module.exports = Task