const mongoose = require('mongoose')

// Define the user schema
const MemberTaskSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    is_active: { type: Boolean, default: true },
    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Task'
    },
    user_invite: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true })

const MemberTask = mongoose.model('MemberTask', MemberTaskSchema)

module.exports = MemberTask