// services/project/uploadFileService.js
const Attachments = require('~/models/AttachmentsSchema')
const Task = require('~/models/TaskSchema')

const uploadFileService = {
    uploadFile: async (fileData) => {
        try {
            console.log('Creating project file with data:', fileData);
            
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
                url: fileData.url, // Use the Google Cloud Storage URL directly
                mimeType: fileData.mimeType,
                size: fileData.size,
                uploadedBy: fileData.uploadedBy,
                entityId: fileData.entityId,
                entityType: fileData.entityType,
                is_active: true
            })

            await attachment.save()
            console.log('Project file saved:', attachment._id);

            // Add attachment to task
            const getNewAttachment = await Attachments.findById(attachment._id)
            if (getNewAttachment) {
                await addAttachmentToTask(getNewAttachment)
            }

            return getNewAttachment
        } catch (error) {
            console.error('Error in uploadFile:', error);
            throw error
        }
    },

    getFilesByTaskId: async (taskId) => {
        try {
            if (!taskId) {
                return []
            }
            const attachments = await Attachments.find({
                entityId: taskId,
                entityType: 'Task',
                is_active: true
            }).populate('uploadedBy', 'displayName image').sort({ createdAt: -1 })

            return attachments.map(attachment => ({
                _id: attachment._id,
                originalName: attachment.originalName,
                fileName: attachment.fileName,
                url: attachment.url,
                mimeType: attachment.mimeType,
                size: attachment.size,
                uploadedBy: attachment.uploadedBy,
                createdAt: attachment.createdAt
            }));
        } catch (error) {
            throw error
        }
    },

    updateAttachment: async (id, updateData) => {
        try {
            const attachment = await Attachments.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            ).populate('uploadedBy', 'displayName image')

            if (!attachment) {
                throw new Error('Attachment not found')
            }

            // Update task attachments if needed
            await deleteAttachmentToTask(attachment)

            return attachment
        } catch (error) {
            throw error
        }
    },

    deleteAttachment: async (id) => {
        try {
            const attachment = await Attachments.findById(id)
            if (!attachment) {
                throw new Error('Attachment not found')
            }

            // Remove attachment from task
            await Task.findByIdAndUpdate(
                attachment.entityId,
                { $pull: { attachments_id: attachment._id } }
            )

            // Delete the attachment
            await attachment.deleteOne()

            return attachment
        } catch (error) {
            console.error('Error in deleteAttachment:', error)
            throw error
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
        throw new Error(`Error removing attachment from task: ${error.message}`)
    }
}

module.exports = uploadFileService