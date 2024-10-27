const ProjectRole = require('~/models/ProjectRoleSchema')

const createNewRole = async (reqBody) => {
    try {
        // Create new role data
        const newRoleData = {
            ...reqBody
        }

        const newRole = new ProjectRole(newRoleData)
        const createdRole = await newRole.save()
        return createdRole
    } catch (error) {
        throw new Error(`Error creating new role: ${error.message}`)
    }
}

const updateRole = async (roleId, updateData) => {
    try {
        const updatedRole = await ProjectRole.findByIdAndUpdate(
            roleId,
            { $set: updateData },
            { new: true, runValidators: true } // Đảm bảo trả về bản ghi mới và chạy validation
        )

        if (!updatedRole) {
            throw new Error('Role not found')
        }

        return updatedRole
    } catch (error) {
        throw new Error(`Error updating role: ${error.message}`)
    }
}

const getAllMembersByProjectId = async (projectId) => {
    try {
        const members = await ProjectRole.find({ projectId:projectId })
            .populate('memberId', 'displayName email image')
            .select('memberId isRole')
        return members
    } catch (error) {
        throw new Error(`Error fetching members for project ${projectId}: ${error.message}`)
    }
}

module.exports = { createNewRole, updateRole, getAllMembersByProjectId }