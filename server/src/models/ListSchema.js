const mongoose = require('mongoose')

// Lists Schema
const ListSchema = new mongoose.Schema(
    {
        list_name: { type: String, required: true },
        project_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' },
        task_id: [{ type: mongoose.Schema.Types.ObjectId, default: [], ref: 'Task' }],
        created_by_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        is_active: { type: Boolean, default: true }
    },
    { timestamps: true }
)

const List = mongoose.model('List', ListSchema)

module.exports = List