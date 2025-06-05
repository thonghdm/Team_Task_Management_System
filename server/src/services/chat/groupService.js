const Group = require('~/models/GroupSchema')
const Conversation = require('~/models/ConversationSchema')
const createGroup = async (name, description, creatorId, memberIds, avatar = null) => {
    const group = new Group({
        name,
        description,
        creator: creatorId,
        members: [creatorId, ...memberIds],
        avatar: avatar,
        admins: [creatorId]
    })
    await group.save()

    const conversation = new Conversation({
        participants: group.members,
        isGroup: true,
        groupInfo: {
            _id: group._id,
            name: group.name,
            avatar: avatar,
            description: description,
            admins: [creatorId]
        },
        unreadCounts: group.members.map(id => ({ user: id, count: 0 }))
    })
    await conversation.save()

    // Populate participants before returning
    const populatedConversation = await Conversation.findById(conversation._id)
        .populate('participants', 'displayName image');

    return { group, conversation: populatedConversation }
}

const addMemberToGroup = async (conversationId, newMemberId, adminId) => {
    // Tìm conversation thay vì group
    const conversation = await Conversation.findById(conversationId)
    const group = await Group.findById(conversation.groupInfo._id)
    if (!conversation) {
        throw new Error('Conversation not found')
    }
    if (!group) {
        throw new Error('Group not found')
    }
    if (!conversation.isGroup) {
        throw new Error('This is not a group conversation')
    }

    // Kiểm tra quyền admin (tạm thời cho phép tất cả thành viên thêm người)
    if (!conversation.participants.includes(adminId)) {
        throw new Error('You are not a member of this group')
    }

    // Kiểm tra xem user đã là thành viên chưa
    if (group.members.includes(newMemberId)) {
        throw new Error('User is already a member of this group')
    }
    if (!group.members.includes(newMemberId)) {
        group.members.push(newMemberId)
        await group.save()
    }
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
    const group = await Group.findById(conversation.groupInfo._id)
    if (!conversation) {
        throw new Error('Conversation not found')
    }
    if (!group) {
        throw new Error('Group not found')
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
    if (group.members.includes(memberId)) {
        group.members = group.members.filter(id => id.toString() !== memberId.toString())
        await group.save()
    }
    

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
    const group = await Group.findById(conversation.groupInfo._id);
    if (!group) {
        throw new Error('Group not found');
    }
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
    group.avatar = avatarUrl;
    await group.save();
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

const leaveGroup = async (conversationId, memberId) => {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new Error('Conversation not found');
    if (!conversation.isGroup) throw new Error('This is not a group conversation');
    const group = await Group.findById(conversation.groupInfo._id);
    if (!group) throw new Error('Group not found');

    // Kiểm tra nếu là admin
    const isAdmin = conversation.groupInfo.admins.some(id => id.toString() === memberId.toString());
    if (isAdmin) {
        if (conversation.groupInfo.admins.length === 1) {
            throw new Error('The last admin cannot leave the group. Please transfer admin rights to someone else first!');
        }
        // Xóa khỏi danh sách admin
        conversation.groupInfo.admins = conversation.groupInfo.admins.filter(id => id.toString() !== memberId.toString());
    }
    // Xóa khỏi participants/members
    conversation.participants = conversation.participants.filter(id => id.toString() !== memberId.toString());
    conversation.unreadCounts = conversation.unreadCounts.filter(uc => uc.user.toString() !== memberId.toString());
    await conversation.save();
    group.members = group.members.filter(id => id.toString() !== memberId.toString());
    await group.save();
    await conversation.populate('participants', 'displayName email image');
    return conversation;
}

module.exports = {
    createGroup,
    addMemberToGroup,
    removeMemberFromGroup,
    makeGroupAdmin,
    removeGroupAdmin,
    updateGroupAvatar,
    leaveGroup
}