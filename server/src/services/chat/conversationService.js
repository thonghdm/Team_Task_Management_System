const Message = require('~/models/MessageSchema')
const Conversation = require('~/models/ConversationSchema')

const findConversationBetweenUsers = async (userId, otherUserId) => {
    const conversation = await Conversation.findOne({
        participants: { $all: [userId, otherUserId] },
        isGroup: false
    }).populate('participants', 'displayName image');
    return conversation;
}

const createConversationBetweenUsers = async (userId, otherUserId) => {
    let conversation = await Conversation.findOne({
        participants: { $all: [userId, otherUserId] },
        isGroup: false
    });
    if (!conversation) {
        conversation = new Conversation({
            participants: [userId, otherUserId],
            isGroup: false,
            unreadCounts: [
                { user: userId, count: 0 },
                { user: otherUserId, count: 0 }
            ]
        });
        await conversation.save();
    }
    // Populate participants before returning
    return await Conversation.findById(conversation._id)
        .populate('participants', 'displayName image');
}

const createGroupConversation = async (groupName, participantIds, creatorId) => {
    const conversation = new Conversation({
        participants: participantIds,
        isGroup: true,
        groupInfo: {
            name: groupName,
            admins: [creatorId]
        },
        unreadCounts: participantIds.map(participantId => ({
            user: participantId,
            count: 0
        }))
    })
    await conversation.save()
    return conversation}
const getConversationMessages = async (conversationId, page = 1, limit = 50) => {
    const skip = (page - 1) * limit
    const messages = await Message.find({ conversation: conversationId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('sender', 'displayName image')
        .populate('seenBy.user', 'displayName image')
        .lean()
    return messages.reverse()
}
const getConversationList = async (userId) => {
    const conversations = await Conversation.find({
        participants: userId })
        .populate('participants', 'displayName image')
        .populate({
            path: 'lastMessage',
            populate: { path: 'sender', select: 'displayName image' }
        })
        .sort({ updateAt: -1 })
    return conversations
}

const sendMessage = async (senderId, conversationId, messageData) => {
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
        throw new Error('Conversation not found')
    }
    const message = new Message({
        ...messageData,
        sender: senderId,
        conversation: conversationId,
        seenBy: [{ user: senderId }]
    })
    await message.save()
    conversation.lastMessage = message._id
    conversation.unreadCounts.forEach(unreadCount =>
    {
        if (unreadCount.user.toString() !== senderId.toString())
        {
            unreadCount.count++
        }
    })
    await conversation.save()
    return message.populate('sender', 'displayName image')
}
const markMessageAsSeen = async (messageId, userId) => {
    const message = await Message.findById(messageId)
    if (!message) {
        throw new Error('Message not found')
    }
    if (!message.seenBy.some(seenBy => seenBy.user.toString() === userId.toString())) {
        message.seenBy.push({ user: userId })
        await message.save()
    }
    return message
}
const markConversationAsRead = async (conversationId, userId) => {
    await Conversation.findByIdAndUpdate(
        conversationId,
        { $set: { 'unreadCounts.$[elem].count': 0 } },
        { arrayFilters: [{ 'elem.user': userId }] }
    )
    const messages = await Message.findOne({ conversation: conversationId })
    for (let message of messages) {
        await this.markMessageAsSeen(userId, message._id)
    }
}

module.exports = {
    findConversationBetweenUsers,
    createConversationBetweenUsers,
    createGroupConversation,
    getConversationMessages,
    getConversationList,
    sendMessage,
    markMessageAsSeen,
    markConversationAsRead
}
