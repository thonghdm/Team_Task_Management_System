const mongoose = require('mongoose')
require('~/config/connectDB')
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
    ownerId: {
        type: String,
        required: true
    },
    membersId: [
        {
            type: String
        }
    ],
    listId: {
        type: [String],
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

module.exports = { Project }
