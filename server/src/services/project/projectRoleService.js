const ProjectRole = require('~/models/ProjectRoleSchema')
const Project = require('~/models/ProjectSchema')
const createNewRole = async (rolesArray) => {
    try {
        for (const role of rolesArray) {
            const { projectId, memberId } = role
            const project = await Project.findById(projectId)
            if (!project) {
                throw new Error(`Project with ID ${projectId} not found`)
            }
            if (project.membersId.includes(memberId)) {
                throw new Error(`User ${memberId} is already a member of project ${projectId}`)
            }
        }

        const rolesData = rolesArray.map(role => ({
            ...role
        }))

        const createdRoles = await ProjectRole.insertMany(rolesData)

        const projectUpdates = createdRoles.map(async role => {
            const { projectId, memberId } = role
            return Project.findByIdAndUpdate(
                projectId,
                {
                    $addToSet: {
                        membersId: memberId
                    }
                },
                { new: true }
            )
        })
        await Promise.all(projectUpdates)

        return createdRoles
    } catch (error) {
        throw new Error(`Error creating new roles: ${error.message}`)
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
        const members = await ProjectRole.find({ projectId: projectId })
            .populate('memberId', 'displayName email image')
            .select('memberId isRole createdAt is_active')
        return members
    } catch (error) {
        throw new Error(`Error fetching members for project ${projectId}: ${error.message}`)
    }
}

module.exports = { createNewRole, updateRole, getAllMembersByProjectId }