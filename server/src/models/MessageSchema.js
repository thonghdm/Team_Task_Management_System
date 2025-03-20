const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    messageType: {
        type: String,
        enum: ['text', 'file'],
        default: 'text'
    },
    content: {
        type: String,
        trim: true,
        maxlength: [4000, 'Message cannot be longer than 4000 characters'],
        validate: {
            validator: function (v) {
                return this.messageType === 'text' ? !!v : true;
            },
            message: 'Content is required for text messages'
        }
    },
    file: {
        type: String,
        validate: {
            validator: function (v) {
                return this.messageType === 'file' ? !!v : true;
            },
            message: 'File is required for file messages'
        }
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    seenBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        seenAt: {
            type: Date,
            default: Date.now
        }
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message
