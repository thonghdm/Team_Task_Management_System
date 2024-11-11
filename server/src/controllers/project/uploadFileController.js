// controllers/uploadFileController.js
const uploadFileService = require('~/services/project/uploadFileService')
const { StatusCodes } = require('http-status-codes')
const fs = require('fs')
const { getRelativeSrcPath } = require('~/utils/getRelativeSrcPath')

const uploadFileController = {
    uploadFile: async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'No file uploaded!'
                })
            }
            // Extract relative path from "src" onward
            const relativeSrcPath = getRelativeSrcPath(req.file.path)

            const fileData = {
                originalName: req.file.originalname,
                fileName: req.file.filename,
                mimeType: req.file.mimetype,
                size: req.file.size,
                uploadedBy: req.body.uploadedBy,
                entityId: req.body.entityId,
                entityType: req.body.entityType,
                url: relativeSrcPath
            }

            const createFile = await uploadFileService.uploadFile(fileData)

            res.status(StatusCodes.CREATED).json({
                message: 'File uploaded successfully!',
                file: createFile
            })
        } catch (error) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) next(err)
                })
            }
            next(error)
        }
    },
    getFilesByTaskId: async (req, res) => {
        try {
            const { taskId } = req.params
            const files = await uploadFileService.getFilesByTaskId(taskId)
            res.status(StatusCodes.OK).json(files)
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    },
    updateAttachment: async (req, res) => {
        const { id } = req.params
        const updateData = req.body
        try {
            const updatedAttachment = await uploadFileService.updateAttachment(id, updateData)
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Attachment updated successfully',
                data: updatedAttachment
            })
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = uploadFileController