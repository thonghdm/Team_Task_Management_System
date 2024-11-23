const mongoose = require('mongoose')

const LabelSchema = new mongoose.Schema({
    task_id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    color: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true }
)

const Label = mongoose.model('Label', LabelSchema)
module.exports = Label
