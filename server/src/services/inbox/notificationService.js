const notificationService = {
    /**
     * Notify users about an incoming call
     */
    // Enhanced notifyIncomingCall function
    notifyIncomingCall: (io, onlineUsers, call, recipientIds) => {
        recipientIds.forEach(recipientId => {
            const recipientSocketId = onlineUsers.get(recipientId.toString());
            if (recipientSocketId) {
                // Send a well-structured notification
                const notificationData = {
                    call: {
                        _id: call._id,
                        groupId: call.group // Include group ID if available
                    },
                    caller: call.caller
                };

                io.to(recipientSocketId).emit('incoming_call', notificationData);

                // Send a test event to verify the socket is working
                io.to(recipientSocketId).emit('test_event', { message: 'This is a test notification' });
            } else {
                console.log(`User ${recipientId} is offline or not found in onlineUsers map`);
            }
        });
    },

    /**
     * Notify caller that call was accepted
     */
    notifyCallAccepted: (io, onlineUsers, callId, callerId, acceptedBy) => {
        const callerSocketId = onlineUsers.get(callerId.toString())

        if (callerSocketId) {
            io.to(callerSocketId).emit('call_accepted', {
                callId,
                acceptedBy
            })
        }
    },

    /**
     * Notify caller that call was declined
     */
    notifyCallDeclined: (io, onlineUsers, callId, callerId, declinedBy) => {
        const callerSocketId = onlineUsers.get(callerId.toString())

        if (callerSocketId) {
            io.to(callerSocketId).emit('call_declined', {
                callId,
                declinedBy
            })
        }
    },

    /**
     * Notify all participants that call has ended
     */
    notifyCallEnded: (io, onlineUsers, call, endedBy) => {
        const participantsToNotify = [call.caller.toString(), ...call.participants.map(p => p.toString())]

        participantsToNotify.forEach(participantId => {
            const participantSocketId = onlineUsers.get(participantId)

            if (participantSocketId) {
                io.to(participantSocketId).emit('call_ended', {
                    callId: call._id,
                    endedBy,
                    duration: call.duration
                })
            }
        })
    },

    /**
     * Notify participants that a user joined the call
     */
    notifyUserJoinedCall: (io, onlineUsers, callId, userId, participants) => {
        participants.forEach(participantId => {
            const participantSocketId = onlineUsers.get(participantId.toString())

            if (participantSocketId) {
                io.to(participantSocketId).emit('user_joined_call', {
                    callId,
                    userId
                })
            }
        })
    }
}

module.exports = notificationService
