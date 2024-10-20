const mongoose = require('mongoose')

// Lists Schema
const ListSchema = new mongoose.Schema(
    {
        list_name: { type: String, required: true },
        project_id: { type: String, required: true }, // Ideally, use ObjectId if it's referencing a Project model
        task_id: [{ type: String }], // Consider using ObjectId if referencing a Task model
        is_active: { type: Boolean, default: true }
    },
    { timestamps: true } // This will add createdAt and updatedAt fields automatically
)

const List = mongoose.model('List', ListSchema)

module.exports = List

