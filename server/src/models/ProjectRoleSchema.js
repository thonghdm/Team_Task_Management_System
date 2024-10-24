const mongoose = require('mongoose')

// Define the user schema
const userSchema = new mongoose.Schema({
    isRole: {
        type: String,
        enum: ['Admin', 'Member', 'Viewer'],
        default: 'Viewer'
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project'
    }
}, { timestamps: true })

const User = mongoose.model('ProjectRole', userSchema)

module.exports = User
