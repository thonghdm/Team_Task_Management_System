const mongoose = require('mongoose')

const descriptionDefault = '<p><strong><em><u>Add new description</u></em></strong></p>'

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
        type: String,
        default: descriptionDefault
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'User'
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
    color: {
        type: String,
        default: '#000000'
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
