const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema(
    {
        project_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' }, // Ideally, use ObjectId if it's referencing a Project model
        list_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'List' }, // Ideally, use ObjectId if it's referencing a List model
        task_name: { type: String, required: true },
        description: { type: String },
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
        assigned_to_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Consider using ObjectId if referencing a User model
        created_by_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },// Consider using ObjectId
        start_date: { type: Date },
        end_date: { type: Date },
        is_active: { type: Boolean, default: true },
        comment_id: [{ type: String }], // Consider using ObjectId if referencing Comment model
        attachments_id: [{ type: String }], // Consider using ObjectId if referencing Attachment model
        label_id: [{ type: String }] // Consider using ObjectId if referencing Label model
    },
    { timestamps: true } // This will add createdAt and updatedAt fields automatically
)

const Task = mongoose.model('Task', TaskSchema)

module.exports = Task