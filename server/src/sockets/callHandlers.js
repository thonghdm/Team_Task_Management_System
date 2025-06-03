const VideoCall = require('~/models/VideoCallSchema');
const videoCallService = require('~/services/inbox/videoCallServices');
const notificationService = require('~/services/inbox/notificationService');

module.exports = (io, socket, onlineUsers) => {
    const videoCallSocketHandler = {
        /**
         * Bắt đầu cuộc gọi
         */
        initiateCall: async (data) => {
            try {
                const { callId, recipientIds } = data;
                // const call = await VideoCall.findById(callId).populate()
                const call = await VideoCall.findById(callId)
                    .populate('caller', 'displayName image') // Lấy tên, username và avatar của người gọi
                    // .populate('group', 'name') // Lấy tên của nhóm
                    // .populate('participants', 'name username image'); //
                if (!call) {
                    return socket.emit('call_error', { message: 'Call not found', callId });
                }

                // Gửi thông báo cuộc gọi đến người nghe
                notificationService.notifyIncomingCall(io, onlineUsers, call, recipientIds);
                socket.emit('call_initiated', { callId: call._id });
            } catch (error) {
                handleError(error, 'Error initiating call');
            }
        },

        /**
         * Chấp nhận cuộc gọi
         */
        acceptCall: async (data) => {
            try {
                const { callId } = data;
                const call = await videoCallService.acceptCall(callId, socket.userId);

                // Thông báo cho người gọi biết cuộc gọi đã được chấp nhận
                notificationService.notifyCallAccepted(io, onlineUsers, call._id, call.caller.toString(), socket.userId);

                // Thông báo cho các thành viên khác biết có người tham gia cuộc gọi
                notificationService.notifyUserJoinedCall(io, onlineUsers, call._id, socket.userId, call.participants.filter(p => p.toString() !== socket.userId));
            } catch (error) {
                handleError(error, 'Error accepting call');
            }
        },

        /**
         * Từ chối cuộc gọi
         */
        declineCall: async (data) => {
            try {
                const { callId } = data;
                const call = await videoCallService.declineCall(callId, socket.userId);

                // Thông báo cho người gọi biết cuộc gọi đã bị từ chối
                notificationService.notifyCallDeclined(io, onlineUsers, call._id, call.caller.toString(), socket.userId);
            } catch (error) {
                handleError(error, 'Error declining call');
            }
        },

        /**
         * Kết thúc cuộc gọi
         */
        endCall: async (data) => {
            try {
                const { callId } = data;
                const call = await videoCallService.endCall(callId, socket.userId);

                // Thông báo cho tất cả người tham gia biết cuộc gọi đã kết thúc
                notificationService.notifyCallEnded(io, onlineUsers, call, socket.userId);
            } catch (error) {
                handleError(error, 'Error ending call');
            }
        },

        /**
         * Người dùng tham gia phòng cuộc gọi
         */
        joinCallRoom: async (data) => {
            try {
                const { callId } = data;
                socket.join(`call:${callId}`);
                socket.to(`call:${callId}`).emit('user_joined_call', { callId, userId: socket.userId });
            } catch (error) {
                handleError(error, 'Error joining call room');
            }
        },

        /**
         * Người dùng rời phòng cuộc gọi
         */
        leaveCallRoom: async (data) => {
            try {
                const { callId } = data;
                socket.leave(`call:${callId}`);
                socket.to(`call:${callId}`).emit('user_left_call', { callId, userId: socket.userId });
            } catch (error) {
                handleError(error, 'Error leaving call room');
            }
        },

        /**
         * Xử lý WebRTC signaling
         */
        handleSignal: (data) => {
            const { callId, to, signal } = data;
            const recipientSocketId = onlineUsers.get(to);

            if (recipientSocketId) {
                io.to(recipientSocketId).emit('signal', { callId, from: socket.userId, signal });
            }
        }
    };

    const taskSocketHandler = {
        /**
         * Xử lý khi task được review
         */
        handleTaskReview: ({ taskId, projectId }) => {
            // Broadcast task review event to all users in the project room
            io.to(`project_${projectId}`).emit('task_reviewed', { taskId });
        },

        /**
         * Người dùng tham gia phòng project
         */
        joinProjectRoom: ({ projectId }) => {
            socket.join(`project_${projectId}`);
        },

        /**
         * Người dùng rời phòng project
         */
        leaveProjectRoom: ({ projectId }) => {
            socket.leave(`project_${projectId}`);
        },

        handleTaskUpdated: ({ taskId, projectId }) => {
            // Broadcast task update event to all users in the project room
            io.to(`project_${projectId}`).emit('task_updated', { taskId });
        }
    };

    /**
     * Hàm xử lý lỗi chung
     */
    const handleError = (error, message) => {
        console.error(message, error);
        socket.emit('call_error', { message: error.message });
    };

    // Đăng ký các sự kiện socket.io
    socket.on('initiate_call', videoCallSocketHandler.initiateCall);
    socket.on('accept_call', videoCallSocketHandler.acceptCall);
    socket.on('decline_call', videoCallSocketHandler.declineCall);
    socket.on('end_call', videoCallSocketHandler.endCall);
    socket.on('join_call_room', videoCallSocketHandler.joinCallRoom);
    socket.on('leave_call_room', videoCallSocketHandler.leaveCallRoom);
    socket.on('signal', videoCallSocketHandler.handleSignal);

    // Đăng ký các sự kiện task
    socket.on('task_review', taskSocketHandler.handleTaskReview);
    socket.on('task_updated', taskSocketHandler.handleTaskUpdated);
    socket.on('join_project_room', taskSocketHandler.joinProjectRoom);
    socket.on('leave_project_room', taskSocketHandler.leaveProjectRoom);
};