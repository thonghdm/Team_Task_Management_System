const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isGroup: {
        type: Boolean,
        default: false
    },
    groupInfo: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        },
        name: {
            type: String,
            required: function() { return this.isGroup; }
        },
        avatar: String,
        description: String,
        admins: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    unreadCounts: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        count: {
            type: Number,
            default: 0
        }
    }]
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;