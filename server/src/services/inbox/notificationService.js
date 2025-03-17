const notificationService = {
    /**
     * Notify users about an incoming call
     */
    notifyIncomingCall: (io, onlineUsers, call, recipientIds) => {
        recipientIds.forEach(recipientId => {
            const recipientSocketId = onlineUsers.get(recipientId.toString());
            console.log(`Sending call notification to ${recipientId}, socketId: ${recipientSocketId}`);

            if (recipientSocketId) {
                io.to(recipientSocketId).emit('incoming_call', {
                    call,
                    caller: call.caller
                });
            }else {
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
