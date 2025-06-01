const mongoose = require('mongoose')

const VideoCallSchema = new mongoose.Schema({
    caller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    activeParticipants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['ringing', 'accepted', 'declined', 'missed', 'ended'],
        default: 'ringing'
    },
    startedAt: {
        type: Date
    },
    endedAt: {
        type: Date
    },
    duration: {
        type: Number, // in seconds
        default: 0
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }
}, { timestamps: true })

const VideoCall = mongoose.model('VideoCall', VideoCallSchema)
module.exports = VideoCall
