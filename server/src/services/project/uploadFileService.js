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

    getFileById: async (fileId) => {
        try {
            console.log('Getting file by ID:', fileId);
            const file = await Attachments.findById(fileId);
            if (!file) {
                throw new Error('File not found');
            }
            return file;
        } catch (error) {
            console.error('Error in getFileById:', error);
            throw error;
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

    updateAttachment: async (id, updateData) => {
        try {
            const attachment = await Attachments.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true }
            )
            if (!attachment) {
                throw new Error('Attachment not found')
            }
            return attachment
        } catch (error) {
            throw error
        }
    },

    deleteAttachment: async (id) => {
        try {
            const attachment = await Attachments.findByIdAndUpdate(
                id,
                { $set: { is_active: false } },
                { new: true }
            )
            if (!attachment) {
                throw new Error('Attachment not found')
            }
            return attachment
        } catch (error) {
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