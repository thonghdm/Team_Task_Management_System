const { StatusCodes } = require('http-status-codes')
const memberTaskService = require('~/services/project/memberTaskService')
// const mongoose = require('mongoose')
const memberTaskController = {
    updateMember: async (req, res, next) => {
        const { _id } = req.body
        if (!_id) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: `Member ${_id} is required` })
        }
        try {
            const updatedMember = await memberTaskService.updateMemberTask(_id, req.body)
            res.status(StatusCodes.OK).json({
                message: 'Member updated successfully!',
                member: updatedMember
            })
        } catch (error) {
            next(error)
        }
    },
    getMemberTasks: async (req, res, next) => {
        const { memberId } = req.params
        try {
            const tasks = await memberTaskService.getMemberTasksByMemberId(memberId)
            if (!tasks || tasks.length === 0) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No tasks found for this member' })
            }
            res.status(StatusCodes.OK).json(tasks)
        } catch (error) {
            next(error)
        }
    }

}

module.exports = memberTaskController