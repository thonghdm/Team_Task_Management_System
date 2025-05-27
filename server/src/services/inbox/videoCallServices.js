const VideoCall = require('~/models/VideoCallSchema')
const Group = require('~/models/GroupSchema')

const VideoCallService = {
    createVideoCall: async (callerUserId, participantIds, groupId = null) => {
        try {
            const videoCall = await VideoCall.create({
                caller: callerUserId,
                participants: participantIds,
                group: groupId,
                startedAt: new Date(),
            });

            // Uncomment nếu bạn muốn populate dữ liệu
            // await videoCall.populate([
            //   { path: 'caller', select: 'username avatar' },
            //   { path: 'participants', select: 'username avatar isOnline' }
            // ]);

            return videoCall;
        } catch (error) {
            console.error('Error creating video call:', error);
            throw error;
        }
    },

    validateGroupAccess: async (groupId, userId) => {
        if (!groupId) return true

        const group = await Group.findById(groupId)
        if (!group) {
            throw new Error('Group not found')
        }

        if (!group.members.includes(userId)) {
            throw new Error('You are not a member of this group')
        }

        return group
    },
    acceptCall: async (callId, userId) => {
        const call = await VideoCall.findById(callId)
        if (!call) {
            throw new Error('Call not found')
        }

        if (!call.participants.includes(userId)) {
            throw new Error('You are not a participant in this call')
        }

        if (call.status === 'ringing') {
            call.status = 'accepted'
            if (!call.startedAt) {
                call.startedAt = new Date()
            }
            await call.save()
        }

        return call
    },
    declineCall: async (callId, userId) => {
        const call = await VideoCall.findById(callId)

        if (!call) {
            throw new Error('Call not found')
        }

        // Check if user is a participant in the call
        if (!call.participants.includes(userId)) {
            throw new Error('You are not a participant in this call')
        }

        // Update call status
        if (call.status === 'ringing') {
            call.status = 'declined'
            await call.save()
        }

        return call
    },
    endCall: async (callId, userId) => {
        const call = await VideoCall.findById(callId)

        if (!call) {
            throw new Error('Call not found')
        }

        // Check if user is caller or participant
        if (call.caller.toString() !== userId && !call.participants.includes(userId)) {
            throw new Error('You are not authorized to end this call')
        }

        // Update call status and duration
        call.status = 'ended'
        call.endedAt = new Date()

        if (call.startedAt) {
            call.duration = Math.round((call.endedAt - call.startedAt) / 1000) // duration in seconds
        }

        await call.save()

        return call
    },
    /**
     * Get call history for a user
     */
    getCallHistory: async (userId) => {
        const calls = await VideoCall.find({
            $or: [
                { caller: userId },
                { participants: userId }
            ]
        })
            // .populate('caller', 'username avatar')
            // .populate('participants', 'username avatar')
            // .populate('group', 'name avatar')
            .sort({ createdAt: -1 })

        return calls
    },
    getActiveCall: async (userId) => {
        const activeCall = await VideoCall.findOne({
            $or: [
                { caller: userId },
                { participants: userId }
            ],
            status: { $in: ['ringing', 'accepted'] }
        })
        // .populate('caller', 'username avatar')
        // .populate('participants', 'username avatar')
        // .populate('group', 'name avatar')

        if (!activeCall) {
            throw new Error('No active call found')
        }

        return activeCall
    },

    /**
     * Get call details by ID
     */
    getCallById: async (callId, userId) => {
        const call = await VideoCall.findById(callId)
        // .populate('caller', 'username avatar')
        // .populate('participants', 'username avatar')
        // .populate('group', 'name avatar')

        if (!call) {
            throw new Error('Call not found')
        }

        // Check if user is caller or participant
        if (call.caller._id.toString() !== userId &&
            !call.participants.some(p => p._id.toString() === userId)) {
            throw new Error('You are not authorized to view this call')
        }

        return call
    },

    /**
     * Get active group call if exists
     */
    getActiveGroupCall: async (groupId) => {
        const activeCall = await VideoCall.findOne({
            group: groupId,
            status: { $in: ['ringing', 'accepted'] }
        })
        // .populate('caller', 'username avatar')
        // .populate('participants', 'username avatar')
        // .populate('group', 'name avatar')

        if (!activeCall) {
            throw new Error('No active group call found')
        }

        return activeCall
    }
}

module.exports = VideoCallService