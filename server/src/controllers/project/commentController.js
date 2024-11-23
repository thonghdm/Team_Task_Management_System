const commentService = require('~/services/project/commentService')
const { StatusCodes } = require('http-status-codes')
// const mongoose = require('mongoose')
const commentController = {
    createComment: async (req, res, next) => {
        try {
            const createComment = await commentService.createComment(req.body)
            res.status(StatusCodes.CREATED).json({
                message: 'Comment created successfully!',
                comment: createComment
            })
        } catch (error) {
            next(error)
        }
    },
    getComment: async (req, res, next) => {
        try {
            const comment = await commentService.getComment(req.params.id)
            res.status(StatusCodes.OK).json({
                comment,
                message: 'Successfully retrieved comment.'
            })
        } catch (error) {
            next(error)
        }
    },
    updateComment: async (req, res, next) => {
        const { _id } = req.body
        if (!_id) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: `Comment ${ _id} is required` })
        }
        try {
            const updatedComment = await commentService.updateComment(_id, req.body)
            res.status(StatusCodes.OK).json({
                message: 'Comment updated successfully!',
                comment: updatedComment
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = commentController