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
                url: process.env.URL_SERVER + fileData.url.replace('src', ''),
                mimeType: fileData.mimeType,
                size: fileData.size,
                entityId: fileData.entityId,
                entityType: fileData.entityType,
                uploadedBy: fileData.uploadedBy
            })
            await attachment.save()

            const getNewAttachment = await Attachments.findById(attachment._id)
            if (getNewAttachment) {
                await addAttachmentToTask(getNewAttachment)
            }
            return getNewAttachment
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
            else {
                await deleteAttachmentToTask(updatedAttachment)
            }
            return updatedAttachment
        } catch (error) {
            throw new Error(`Failed to update attachment: ${error.message}`)
        }
    }
}

const addAttachmentToTask = async (attachment) => {
    try {
        const updatedDocument = await Task.findOneAndUpdate(
            { _id: attachment.entityId },
            { $push: { attachments_id: attachment._id } },
            { returnDocument: 'after' }
        )
        return updatedDocument
    } catch (error) {
        throw new Error(`Error adding attachment to task: ${error.message}`)
    }
}

const deleteAttachmentToTask = async (attachment) => {
    try {
        const updatedDocument = await Task.findOneAndUpdate(
            { _id: attachment.entityId },
            { $pull: { attachments_id: attachment._id } },
            { returnDocument: 'after' }
        )
        return updatedDocument
    } catch (error) {
        throw new Error(`Error adding attachment to task: ${error.message}`)
    }
}

module.exports = uploadFileService