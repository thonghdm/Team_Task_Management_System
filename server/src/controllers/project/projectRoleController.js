const projectRoleService = require('~/services/project/projectRoleService')
const { StatusCodes } = require('http-status-codes')

const projectRoleController = {
    createNewRole: async (req, res, next) => {
        try {
            const createdRole = await projectRoleService.createNewRole(req.body)
            res.status(StatusCodes.CREATED).json({
                message: 'Role created successfully!',
                role: createdRole
            })
        } catch (error) {
            next(error)
        }
    },
    deleteMemberProject: async (req, res, next) => {
        try {
            const { projectId, memberId } = req.body
            const deletedActivity = await projectRoleService.deleteMemberProject(projectId, memberId)
            res.status(StatusCodes.OK).json({
                message: 'Role deleted successfully!',
                role: deletedActivity
            })
        } catch (error) {
            next(error)
        }
    },
    updateRole: async (req, res, next) => {
        try {
            const updatedRole = await projectRoleService.updateRole(req.params.id, req.body)
            res.status(StatusCodes.OK).json({
                message: 'Role updated successfully!',
                role: updatedRole
            })
        } catch (error) {
            next(error)
        }
    },
    getAllMemberIdProject: async (req, res, next) => {
        try {
            const members = await projectRoleService.getAllMembersByProjectId(req.params.id)
            res.status(StatusCodes.OK).json({
                members,
                message: 'Successfully retrieved project members.'
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = projectRoleController
