const Comment = require('~/models/CommentSchema')
const Task = require('~/models/TaskSchema')

const createComment = async (reqBody) => {
    try {
        const newCommentData = {
            ...reqBody
        }
        const newComment = new Comment(newCommentData)
        const createdComment = await newComment.save()

        const getNewComment = await Comment.findById(createdComment._id)
        if (getNewComment) {
            await addCommentToTask(getNewComment)
        }
        return getNewComment
    } catch (error) {
        throw new Error(error)
    }
}

const addCommentToTask = async (comment) => {
    try {
        const updatedDocument = await Task.findOneAndUpdate(
            { _id: comment.task_id },
            { $push: { comment_id: comment._id } },
            { returnDocument: 'after' }
        )
        return updatedDocument
    } catch (error) {
        throw new Error(`Error adding comment to task: ${error.message}`)
    }
}

const getComment = async (task_id) => {
    try {
        const comment = await Comment.find({ task_id: task_id })
            .populate('user_id', 'displayName email image')
        return comment
    }
    catch (error) {
        throw new Error(`Error getting comment: ${error.message}`)
    }
}

const updateComment = async (commentId, updateData) => {
    try {
        const existingComment = await Comment.findById(commentId)
        if (!existingComment) {
            throw new Error('Comment not found')
        }
        // Update fields
        Object.assign(existingComment, updateData)
        const updatedComment = await existingComment.save()
        return updatedComment
    } catch (error) {
        throw new Error(`Failed to update comment: ${error.message}`)
    }
}


module.exports = { createComment, getComment, updateComment }
