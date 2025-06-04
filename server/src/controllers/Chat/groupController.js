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
            res.json({ success: true, conversation: updatedConversation })
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        }
    },

    updateGroupAvatar: async (req, res) => {
        upload(req, res, async function(err) {
            try {
                if (err instanceof multer.MulterError) {
                    // Lỗi từ multer
                    return res.status(400).json({ message: `Upload error: ${err.message}` });
                } else if (err) {
                    // Lỗi khác
                    return res.status(400).json({ message: err.message });
                }

                // Kiểm tra xem có file được upload không
                if (!req.file) {
                    return res.status(400).json({ message: 'No file uploaded' });
                }

                const { groupId } = req.body;
                const userId = req.currentUser._id;

                // Upload ảnh lên Cloudinary sử dụng utility function có sẵn
                const imageResult = await uploadToCloudinary(req.file);
                
                // Cập nhật avatar trong database
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
                // Xóa file tạm nếu có lỗi
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
            res.json({ success: true, conversation: updatedConversation });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = groupController