// controllers/uploadFileController.js
const uploadFileService = require('~/services/project/uploadFileService')
const { StatusCodes } = require('http-status-codes')
const { uploadToGCS, deleteFromGCS, downloadFromGCS } = require('~/utils/googleCloudStorage')

const uploadFileController = {
    uploadFile: async (req, res, next) => {
        try {
            console.log('uploadFile controller - req.body:', req.body);
            console.log('uploadFile controller - req.file:', {
                ...req.file,
                buffer: req.file?.buffer ? 'Buffer exists' : 'No buffer'
            });

            if (!req.file) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'No file uploaded!'
                })
            }

            if (!req.body.entityId || !req.body.uploadedBy) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Missing required fields: entityId and uploadedBy are required'
                })
            }

            // Generate a unique filename with timestamp for GCS to avoid duplicates
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
            const destination = `project-files/${req.body.entityId}/${uniqueSuffix}-${req.file.originalname}`

            console.log('Attempting to upload file to GCS:', {
                destination,
                fileSize: req.file.size,
                mimetype: req.file.mimetype,
                buffer: req.file.buffer ? 'Buffer exists' : 'No buffer'
            });

            // Upload to Google Cloud Storage
            const fileUrl = await uploadToGCS(req.file, destination)

            const fileData = {
                originalName: req.file.originalname,
                fileName: destination,
                mimeType: req.file.mimetype,
                size: req.file.size,
                uploadedBy: req.body.uploadedBy,
                entityId: req.body.entityId,
                entityType: req.body.entityType,
                url: fileUrl
            }

            console.log('File uploaded successfully, creating file record with data:', fileData);

            const createFile = await uploadFileService.uploadFile(fileData)

            res.status(StatusCodes.CREATED).json({
                message: 'File uploaded successfully!',
                file: createFile
            })
        } catch (error) {
            console.error('Upload file error:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Error uploading file',
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    },

    downloadFile: async (req, res) => {
        try {
            const { id } = req.params;
            console.log('Downloading file with ID:', id);
            
            const file = await uploadFileService.getFileById(id);
            if (!file) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'File not found'
                });
            }

            console.log('File found in database:', {
                fileName: file.fileName,
                originalName: file.originalName,
                mimeType: file.mimeType
            });

            // Download file from Google Cloud Storage
            const { buffer, metadata } = await downloadFromGCS(file.fileName);

            console.log('File downloaded from GCS:', {
                bufferSize: buffer.length,
                contentType: metadata.contentType,
                size: metadata.size
            });

            // Set appropriate headers
            res.setHeader('Content-Type', metadata.contentType);
            res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.originalName)}`);
            res.setHeader('Content-Length', buffer.length);
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');

            // Send the file buffer
            res.send(buffer);
        } catch (error) {
            console.error('Error downloading file:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Error downloading file',
                error: error.message
            });
        }
    },

    getFilesByTaskId: async (req, res) => {
        try {
            const { taskId } = req.params
            const files = await uploadFileService.getFilesByTaskId(taskId)
            res.status(StatusCodes.OK).json(files)
        } catch (error) {
            console.error('Error getting files:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
                message: 'Error retrieving files',
                error: error.message 
            })
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
            console.error('Error updating attachment:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            })
        }
    },

    deleteFile: async (req, res) => {
        try {
            const { id } = req.params;
            const { fileUrl } = req.body;

            if (!fileUrl) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'File URL is required'
                });
            }

            // Extract filename from URL
            const urlParts = fileUrl.split('/');
            const filename = urlParts[urlParts.length - 1];

            // Delete file from Google Cloud Storage
            await deleteFromGCS(filename);
            console.log('File deleted from GCS:', filename);
            
            // Delete attachment from database
            const deletedAttachment = await uploadFileService.deleteAttachment(id);
            
            res.status(StatusCodes.OK).json({
                message: 'File deleted successfully',
                data: deletedAttachment
            });
        } catch (error) {
            console.error('Error deleting file:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Error deleting file',
                error: error.message
            });
        }
    }
}

module.exports = uploadFileController