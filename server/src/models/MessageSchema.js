const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    messageType: {
        type: String,
        enum: ['text', 'file'],
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === "text";
          },
          maxlength: [4000, "Message cannot be longer than 4000 characters"],
        trim: true,
    },
    file: {
        type: String,
        required: function () {
            return this.messageType === "file";
          },
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: function () {
            return !this.receiver;
          },
    },
    seenBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const Message = mongoose.model('Message', MessageSchema)
module.exports = Message