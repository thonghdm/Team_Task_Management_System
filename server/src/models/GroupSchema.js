const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    videoCall: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VideoCall'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    avatar: {
        type: String,
        default: 'https://via.placeholder.com/150'
    }
    // timestamp: {
    //     type: Date,
    //     default: Date.now
    // }
}, { timestamps: true })

const Group = mongoose.model('Group', GroupSchema)
module.exports = Group