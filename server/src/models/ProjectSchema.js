const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    slug: {
        type: String
    },
    description: {
        type: String
    },
    username: { type: String, unique: true }, // Ensure username field exists
    membersId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    listId: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'List'
            }
        ],
        default: []
    },
    visibility: {
        type: String,
        enum: ['Public', 'Member'],
        default: 'Public'
    },
    favorite: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
})

const Project = mongoose.model('Project', ProjectSchema)

module.exports = Project
