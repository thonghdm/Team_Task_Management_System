const ProjectRole = require('~/models/ProjectRoleSchema')
const Project = require('~/models/ProjectSchema')
import sendEmail from '~/utils/sendEmail'
const createNewRole = async (rolesArray) => {
    try {
        const createdOrUpdatedRoles = []

        for (const role of rolesArray) {
            const { projectId, memberId, isRole, user_invite, user_name_invite, user_email } = role
            // Check if the project exists
            const project = await Project.findById(projectId)
            if (!project) {
                throw new Error(`Project with ID ${projectId} not found`)
            }

            if (!user_invite) {
                throw new Error('User invite is required')
            }

            let existingRole = await ProjectRole.findOne({ projectId, memberId })

            if (existingRole) {
                if (!existingRole.is_active) {
                    existingRole.is_active = true
                    existingRole.isRole = isRole // Update isRole when reactivating
                    await existingRole.save()
                    createdOrUpdatedRoles.push(existingRole)
                } else {
                    throw new Error('One or more users already exist')
                }
            } else {
                const newRole = new ProjectRole({ ...role })
                await newRole.save()
                createdOrUpdatedRoles.push(newRole)
            }

            await Project.findByIdAndUpdate(
                projectId,
                { $addToSet: { membersId: memberId } },
                { new: true }
            )
            sendEmail({
                email: user_email,
                subject: 'Notification from DTPROJECT',
                message: `User ${user_name_invite} has invited you the project  ${project.projectName}`
            })
        }
        return createdOrUpdatedRoles
    } catch (error) {
        throw new Error(`Error creating or updating roles: ${error.message}`)
    }
}


const deleteMemberProject = async (projectId, memberId) => {
    try {
        const updatedRole = await ProjectRole.findOneAndUpdate(
            { projectId, memberId },
            { is_active: false },
            { new: true } // Return the updated document
        )

        if (!updatedRole) {
            throw new Error(`Role with projectId ${projectId} and memberId ${memberId} not found`)
        }

        await Project.findByIdAndUpdate(
            projectId,
            {
                $pull: { membersId: memberId }
            },
            { new: true }
        )

        return updatedRole
    } catch (error) {
        throw new Error(`Error deactivating role: ${error.message}`)
    }
}


const leaveAdminProject = async (projectId, memberId) => {
    try {
        // Check if the project has more than one member
        const project = await Project.findById(projectId)
        if (!project || project.membersId.length <= 1) {
            throw new Error('The project must have more than one member.')
        }
        // Check if there is at least one Admin role remaining after deletion
        const adminRoles = await ProjectRole.find({
            projectId,
            isRole: 'ProjectManager',
            is_active: true,
            memberId: { $ne: memberId }
        })
        if (adminRoles.length === 0) {
            throw new Error('The project must have at least one active ProjectManager.')
        }
        const leaveProject = await ProjectRole.findOneAndUpdate(
            { projectId, memberId },
            { is_active: false },
            { new: true }
        )
        await Project.findByIdAndUpdate(
            projectId,
            {
                $pull: { membersId: memberId }
            },
            { new: true }
        )
        return leaveProject
    } catch (error) {
        throw new Error(`Error deactivating role: ${error.message}`)
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
            .populate('memberId', 'displayName email image username company location jobTitle department phoneNumber')
            .populate('user_invite', 'displayName image jobTitle ')
            .select('memberId user_invite projectId isRole createdAt is_active')
        return members
    } catch (error) {
        throw new Error(`Error fetching members for project ${projectId}: ${error.message}`)
    }
}

module.exports = { createNewRole, updateRole, getAllMembersByProjectId, deleteMemberProject, leaveAdminProject }