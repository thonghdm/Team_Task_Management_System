const Group = require('~/models/GroupSchema')
const Conversation = require('~/models/ConversationSchema')
const createGroup = async (name, description, creatorId, memberIds, avatar = null) => {
    const group = new Group({
        name,
        description,
        creator: creatorId,
        members: [creatorId, ...memberIds],
        admins: [creatorId]
    })
    await group.save()

    const conversation = new Conversation({
        participants: group.members,
        isGroup: true,
        groupInfo: {
            name: group.name,
            avatar: avatar,
            description: description,
            admins: [creatorId]
        },
        unreadCounts: group.members.map(id => ({ user: id, count: 0 }))
    })
    await conversation.save()

    return { group, conversation }
}

const addMemberToGroup = async (conversationId, newMemberId, adminId) => {
    // Tìm conversation thay vì group
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
        throw new Error('Conversation not found')
    }

    if (!conversation.isGroup) {
        throw new Error('This is not a group conversation')
    }

    // Kiểm tra quyền admin (tạm thời cho phép tất cả thành viên thêm người)
    if (!conversation.participants.includes(adminId)) {
        throw new Error('You are not a member of this group')
    }

    // Kiểm tra xem user đã là thành viên chưa
    if (!conversation.participants.includes(newMemberId)) {
        conversation.participants.push(newMemberId)
        conversation.unreadCounts.push({ user: newMemberId, count: 0 })
        await conversation.save()
    }

    // Populate participants để trả về thông tin đầy đủ
    await conversation.populate('participants', 'displayName email image')
    
    return conversation
}

const removeMemberFromGroup = async (conversationId, memberId, adminId) => {
    // Tìm conversation thay vì group
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
        throw new Error('Conversation not found')
    }

    if (!conversation.isGroup) {
        throw new Error('This is not a group conversation')
    }

    // Kiểm tra quyền admin
    if (!conversation.groupInfo.admins.includes(adminId)) {
        throw new Error('Only admins can remove members')
    }

    // Remove member từ participants
    conversation.participants = conversation.participants.filter(id => id.toString() !== memberId.toString())
    
    // Remove member từ admins nếu là admin
    conversation.groupInfo.admins = conversation.groupInfo.admins.filter(id => id.toString() !== memberId.toString())
    
    // Remove từ unreadCounts
    conversation.unreadCounts = conversation.unreadCounts.filter(uc => uc.user.toString() !== memberId.toString())
    
    await conversation.save()

    // Populate để trả về thông tin đầy đủ
    await conversation.populate('participants', 'displayName email image')
    
    return conversation
}

const makeGroupAdmin = async (conversationId, newAdminId, currentAdminId) => {
    // Tìm conversation thay vì group
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
        throw new Error('Conversation not found')
    }

    if (!conversation.isGroup) {
        throw new Error('This is not a group conversation')
    }

    // Kiểm tra quyền admin của người thực hiện
    if (!conversation.groupInfo.admins.includes(currentAdminId)) {
        throw new Error('Only admins can make other members admin')
    }

    // Kiểm tra xem user có phải là thành viên không
    if (!conversation.participants.includes(newAdminId)) {
        throw new Error('User is not a member of this group')
    }

    // Thêm admin nếu chưa là admin
    if (!conversation.groupInfo.admins.includes(newAdminId)) {
        conversation.groupInfo.admins.push(newAdminId)
        await conversation.save()
    }

    // Populate để trả về thông tin đầy đủ
    await conversation.populate('participants', 'displayName email image')
    
    return conversation
}

const updateGroupAvatar = async (groupId, avatarUrl, userId) => {
    // Tìm conversation dựa vào groupId
    const conversation = await Conversation.findById(groupId);
    if (!conversation) {
        throw new Error('Conversation not found');
    }

    // Kiểm tra xem đây có phải là nhóm không
    if (!conversation.isGroup) {
        throw new Error('This is not a group conversation');
    }

    // Kiểm tra xem người dùng có phải là thành viên của nhóm
    if (!conversation.participants.includes(userId)) {
        throw new Error('You are not a member of this group');
    }

    // Cập nhật avatar trong groupInfo
    conversation.groupInfo.avatar = avatarUrl;
    await conversation.save();

    return conversation;
}

const removeGroupAdmin = async (conversationId, adminId, currentAdminId) => {
    // Tìm conversation
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
        throw new Error('Conversation not found')
    }

    if (!conversation.isGroup) {
        throw new Error('This is not a group conversation')
    }

    // Kiểm tra quyền admin của người thực hiện
    if (!conversation.groupInfo.admins.includes(currentAdminId)) {
        throw new Error('You are not an admin of this group')
    }

    // Không thể remove chính mình nếu là admin duy nhất
    if (conversation.groupInfo.admins.length === 1 && conversation.groupInfo.admins.includes(adminId)) {
        throw new Error('Cannot remove the last admin')
    }

    // Remove admin
    conversation.groupInfo.admins = conversation.groupInfo.admins.filter(id => id.toString() !== adminId.toString())
    await conversation.save()

    // Populate để trả về thông tin đầy đủ
    await conversation.populate('participants', 'displayName email image')
    
    return conversation
}

module.exports = {
    createGroup,
    addMemberToGroup,
    removeMemberFromGroup,
    makeGroupAdmin,
    removeGroupAdmin,
    updateGroupAvatar
}