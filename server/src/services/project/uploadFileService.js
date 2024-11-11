// services/project/uploadFileService.js
const Attachments = require('~/models/AttachmentsSchema')
const Task = require('~/models/TaskSchema')

const uploadFileService = {
    uploadFile: async (fileData) => {
        // eslint-disable-next-line no-useless-catch
        try {
            // Validate entity exists based on type
            let entityModel
            switch (fileData.entityType) {
            case 'Task':
                entityModel = Task
                break
            }

            if (entityModel) {
                const entity = await entityModel.findById(fileData.entityId)
                if (!entity) {
                    throw new Error(`${fileData.entityType} not found!`)
                }
            }

            // Create attachment record
            const attachment = new Attachments({
                originalName: fileData.originalName,
                fileName: fileData.fileName,
                url: fileData.url,
                mimeType: fileData.mimeType,
                size: fileData.size,
                entityId: fileData.entityId,
                entityType: fileData.entityType,
                uploadedBy: fileData.uploadedBy
            })

            await attachment.save()
            return attachment

        } catch (error) {
            throw error
        }
    },
    getFilesByTaskId: async (taskId) => {
        if (!taskId) {
            return []
        }
        const attachments = await Attachments.find({
            entityId: taskId,
            entityType: 'Task',
            is_active: true
        })
        if (attachments.length === 0) {
            return []
        }
        return attachments
    },
    updateAttachment: async (attachmentId, updateData) => {
        try {
            // Tìm và cập nhật attachment theo ID, trả về attachment sau khi cập nhật
            const updatedAttachment = await Attachments.findByIdAndUpdate(
                attachmentId,
                updateData,
                { new: true } // Trả về document sau khi cập nhật
            )
            if (!updatedAttachment) {
                return []
            }
            return updatedAttachment
        } catch (error) {
            throw new Error(`Failed to update attachment: ${error.message}`)
        }
    }
}

module.exports = uploadFileService