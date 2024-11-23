const starredService = require('~/services/project/starredService')
const { StatusCodes } = require('http-status-codes')

const starredController = {
    createNew: async (req, res, next) => {
        try {
            const { userId, projectId } = req.body
            const createdStarred = await starredService.createNew({ userId, projectId })
            res.status(StatusCodes.CREATED).json({
                message: 'Project starred successfully!',
                data: createdStarred
            })
        } catch (error) {
            next(error)
        }
    },

    // Lấy tất cả các mục Starred của một người dùng
    getAllByUser: async (req, res, next) => {
        try {
            const { userId } = req.params
            const starredList = await starredService.getAllByUser(userId)
            res.status(StatusCodes.OK).json({
                message: 'Starred projects retrieved successfully!',
                data: starredList
            })
        } catch (error) {
            next(error)
        }
    },

    // Cập nhật trạng thái Starred
    updateStarred: async (req, res, next) => {
        try {
            const { userId, projectId, isStarred } = req.body
            const updatedStarred = await starredService.updateStarred(userId, projectId, isStarred)
            res.status(StatusCodes.OK).json({
                message: 'Starred status updated successfully!',
                data: updatedStarred
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = starredController
