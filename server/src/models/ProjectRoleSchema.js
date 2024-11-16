const mongoose = require('mongoose')

// Define the user schema
const userSchema = new mongoose.Schema({
    isRole: {
        type: String,
        enum: ['Admin', 'Member', 'Viewer'],
        default: 'Member'
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    user_invite: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    is_active: { type: Boolean, default: true }, // whether the account is active
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project'
    }
}, { timestamps: true })

const ProjectRole = mongoose.model('ProjectRole', userSchema)

module.exports = ProjectRole
