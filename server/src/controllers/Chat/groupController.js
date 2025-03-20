const groupService = require('~/services/chat/groupService')
const groupController = {
    createGroup: async (req, res) => {
        try {
            const { name, description, memberIds } = req.body
            const creatorId = req.user.id
            const { group, conversation } = await groupService.createGroup(name, description, creatorId, memberIds)
            res.json({ group, conversation })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    addMemberToGroup: async (req, res) => {
        try {
            const { groupId, newMemberId } = req.body
            const adminId = req.user.id
            const updatedGroup = await groupService.addMemberToGroup(groupId, newMemberId, adminId)
            res.json(updatedGroup)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    removeMemberFromGroup: async (req, res) => {
        try {
            const { groupId, memberId } = req.body
            const adminId = req.user.id
            const updatedGroup = await groupService.removeMemberFromGroup(groupId, memberId, adminId)
            res.json(updatedGroup)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    makeGroupAdmin: async (req, res) => {
        try {
            const { groupId, newAdminId } = req.body
            const currentAdminId = req.user.id
            const updatedGroup = await groupService.makeGroupAdmin(groupId, newAdminId, currentAdminId)
            res.json(updatedGroup)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = groupController