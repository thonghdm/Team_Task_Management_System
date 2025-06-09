const groupService = require('~/services/chat/groupService')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const { uploadToCloudinary } = require('~/utils/cloudinary')

// Cấu hình multer để lưu file tạm thời
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Đảm bảo thư mục uploads tồn tại
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir)
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
    fileFilter: function(req, file, cb) {
        // Kiểm tra loại file
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Chỉ được upload file ảnh!'), false)
        }
        cb(null, true)
    }
}).single('avatar')

const groupController = {
    createGroup: async (req, res) => {
        try {
            const { name, description, memberIds, avatar } = req.body
            console.log('req group', req.user);
            const creatorId = req.currentUser._id
            const { group, conversation } = await groupService.createGroup(name, description, creatorId, memberIds, avatar)
            res.json({ group, conversation })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    addMemberToGroup: async (req, res) => {
        try {
            const { groupId, newMemberId } = req.body
            const adminId = req.currentUser._id
            const updatedGroup = await groupService.addMemberToGroup(groupId, newMemberId, adminId)
            
            if (req.io && updatedGroup) {
                req.io.to(newMemberId.toString()).emit('added_to_group', {
                    conversationId: updatedGroup._id,
                    groupName: updatedGroup.groupInfo.name,
                    addedBy: adminId,
                    conversation: updatedGroup
                });
                

                updatedGroup.participants.forEach(participant => {
                    if (participant._id.toString() !== newMemberId.toString()) {
                        req.io.to(participant._id.toString()).emit('member_added_to_group', {
                            conversationId: updatedGroup._id,
                            newMemberId: newMemberId,
                            addedBy: adminId,
                            conversation: updatedGroup
                        });
                    }
                });
                

                updatedGroup.participants.forEach(participant => {
                    req.io.to(participant._id.toString()).emit('conversation updated', updatedGroup);
                });
            } else {
                console.error('req.io not available or updatedGroup is null:', { hasIo: !!req.io, hasGroup: !!updatedGroup });
            }
            
            res.json({ success: true, group: updatedGroup })
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        }
    },

    removeMemberFromGroup: async (req, res) => {
        try {
            const { groupId, memberId } = req.body
            const adminId = req.currentUser._id
            const updatedConversation = await groupService.removeMemberFromGroup(groupId, memberId, adminId)
            

            if (req.io && updatedConversation) {
                req.io.to(memberId.toString()).emit('removed_from_group', {
                    conversationId: updatedConversation._id,
                    groupName: updatedConversation.groupInfo.name,
                    removedBy: adminId
                });
                
   
                updatedConversation.participants.forEach(participant => {
                    req.io.to(participant._id.toString()).emit('member_removed_from_group', {
                        conversationId: updatedConversation._id,
                        removedMemberId: memberId,
                        removedBy: adminId,
                        conversation: updatedConversation
                    });
                });

                updatedConversation.participants.forEach(participant => {
                    req.io.to(participant._id.toString()).emit('conversation updated', updatedConversation);
                });
            }
            
            res.json({ success: true, conversation: updatedConversation })
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        }
    },

    makeGroupAdmin: async (req, res) => {
        try {
            const { groupId, newAdminId } = req.body
            const currentAdminId = req.currentUser._id
            const updatedConversation = await groupService.makeGroupAdmin(groupId, newAdminId, currentAdminId)
            

            if (req.io && updatedConversation) {
   
                req.io.to(newAdminId.toString()).emit('made_admin', {
                    conversationId: updatedConversation._id,
                    groupName: updatedConversation.groupInfo.name,
                    madeBy: currentAdminId
                });
                

                updatedConversation.participants.forEach(participant => {
                    req.io.to(participant._id.toString()).emit('new_admin_in_group', {
                        conversationId: updatedConversation._id,
                        newAdminId: newAdminId,
                        madeBy: currentAdminId,
                        conversation: updatedConversation
                    });
                });
                

                updatedConversation.participants.forEach(participant => {
                    req.io.to(participant._id.toString()).emit('conversation updated', updatedConversation);
                });
            }
            
            res.json({ success: true, conversation: updatedConversation })
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        }
    },

    removeGroupAdmin: async (req, res) => {
        try {
            const { groupId, adminId } = req.body
            const currentAdminId = req.currentUser._id
            const updatedConversation = await groupService.removeGroupAdmin(groupId, adminId, currentAdminId)
            

            if (req.io && updatedConversation) {

                req.io.to(adminId.toString()).emit('admin_removed', {
                    conversationId: updatedConversation._id,
                    groupName: updatedConversation.groupInfo.name,
                    removedBy: currentAdminId
                });
                

                updatedConversation.participants.forEach(participant => {
                    req.io.to(participant._id.toString()).emit('admin_removed_from_group', {
                        conversationId: updatedConversation._id,
                        removedAdminId: adminId,
                        removedBy: currentAdminId,
                        conversation: updatedConversation
                    });
                });
                

                updatedConversation.participants.forEach(participant => {
                    req.io.to(participant._id.toString()).emit('conversation updated', updatedConversation);
                });
            }
            
            res.json({ success: true, conversation: updatedConversation })
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        }
    },

    updateGroupAvatar: async (req, res) => {
        upload(req, res, async function(err) {
            try {
                if (err instanceof multer.MulterError) {

                    return res.status(400).json({ message: `Upload error: ${err.message}` });
                } else if (err) {

                    return res.status(400).json({ message: err.message });
                }


                if (!req.file) {
                    return res.status(400).json({ message: 'No file uploaded' });
                }

                const { groupId } = req.body;
                const userId = req.currentUser._id;

                const imageResult = await uploadToCloudinary(req.file);
                

                const updatedConversation = await groupService.updateGroupAvatar(
                    groupId,
                    imageResult.url,
                    userId
                );

                res.json({
                    message: 'Group avatar updated successfully',
                    avatar: imageResult.url,
                    groupInfo: updatedConversation.groupInfo
                });
            } catch (error) {

                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                res.status(500).json({ message: error.message });
            }
        });
    },

    leaveGroup: async (req, res) => {
        try {
            const { conversationId } = req.body;
            const memberId = req.currentUser._id;
            const updatedConversation = await groupService.leaveGroup(conversationId, memberId);
            
 
            if (req.io && updatedConversation) {
          
                req.io.to(memberId.toString()).emit('left_group', {
                    conversationId: updatedConversation._id,
                    groupName: updatedConversation.groupInfo.name
                });
                
                updatedConversation.participants.forEach(participant => {
                    req.io.to(participant._id.toString()).emit('member_left_group', {
                        conversationId: updatedConversation._id,
                        leftMemberId: memberId,
                        conversation: updatedConversation
                    });
                });
                
                updatedConversation.participants.forEach(participant => {
                    req.io.to(participant._id.toString()).emit('conversation updated', updatedConversation);
                });
            }
            
            res.json({ success: true, conversation: updatedConversation });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = groupController