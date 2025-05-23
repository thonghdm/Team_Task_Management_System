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

const addMemberToGroup= async (groupId, newMemberId, adminId) => {
    const group = await Group.findById(groupId)
    if (!group) {
        throw new Error('Group not found')
    }

    if (!group.admins.includes(adminId)) {
        throw new Error('Only admins can add members')
    }

    if (!group.members.includes(newMemberId)) {
        group.members.push(newMemberId)
        await group.save()

        const conversation = await Conversation.findOne({ 'groupInfo.name': group.name })
        if (conversation) {
            conversation.participants.push(newMemberId)
            conversation.unreadCounts.push({ user: newMemberId, count: 0 })
            await conversation.save()
        }
    }

    return group
}

const removeMemberFromGroup = async (groupId, memberId, adminId) => {
    const group = await Group.findById(groupId)
    if (!group) {
        throw new Error('Group not found')
    }

    if (!group.admins.includes(adminId)) {
        throw new Error('Only admins can remove members')
    }

    group.members = group.members.filter(id => id.toString() !== memberId.toString())
    group.admins = group.admins.filter(id => id.toString() !== memberId.toString())
    await group.save()

    const conversation = await Conversation.findOne({ 'groupInfo.name': group.name })
    if (conversation) {
        conversation.participants = conversation.participants.filter(id => id.toString() !== memberId.toString())
        conversation.unreadCounts = conversation.unreadCounts.filter(uc => uc.user.toString() !== memberId.toString())
        await conversation.save()
    }

    return group
}
const makeGroupAdmin = async (groupId, newAdminId, currentAdminId) => {
    const group = await Group.findById(groupId)
    if (!group) {
        throw new Error('Group not found')
    }

    if (!group.admins.includes(currentAdminId)) {
        throw new Error('Only admins can make other members admin')
    }

    if (!group.members.includes(newAdminId)) {
        throw new Error('User is not a member of this group')
    }

    if (!group.admins.includes(newAdminId)) {
        group.admins.push(newAdminId)
        await group.save()

        const conversation = await Conversation.findOne({ 'groupInfo.name': group.name })
        if (conversation) {
            conversation.groupInfo.admins.push(newAdminId)
            await conversation.save()
        }
    }

    return group
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

module.exports = {
    createGroup,
    addMemberToGroup,
    removeMemberFromGroup,
    makeGroupAdmin,
    updateGroupAvatar
}