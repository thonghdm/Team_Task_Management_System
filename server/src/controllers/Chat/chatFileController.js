const chatFileService = require('~/services/chat/chatFileService')
const { StatusCodes } = require('http-status-codes')
const { uploadToGCS, downloadFromGCS } = require('~/utils/googleCloudStorage')
const Conversation = require('~/models/ConversationSchema')

const chatFileController = {
    uploadChatFile: async (req, res, next) => {
        try {
            console.log('uploadChatFile controller - req.body:', req.body);
            console.log('uploadChatFile controller - req.file:', req.file);

            if (!req.file) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'No file uploaded!'
                })
            }

            if (!req.body.conversationId || !req.body.uploadedBy) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Missing required fields: conversationId and uploadedBy are required'
                })
            }

            // Generate a unique filename with timestamp for GCS to avoid duplicates
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
            const destination = `chat-files/${req.body.conversationId}/${uniqueSuffix}-${req.file.originalname}`

            console.log('Attempting to upload file to GCS:', {
                destination,
                fileSize: req.file.size,
                mimetype: req.file.mimetype
            });

            // Upload to Google Cloud Storage
            const fileUrl = await uploadToGCS(req.file, destination)

            const fileData = {
                originalName: req.file.originalname, // Keep original name for display and download
                fileName: destination, // Store GCS path with timestamp
                mimeType: req.file.mimetype,
                size: req.file.size,
                uploadedBy: req.body.uploadedBy,
                conversationId: req.body.conversationId,
                url: fileUrl
            }

            console.log('File uploaded successfully, creating message with data:', fileData);

            const messageData = await chatFileService.createFileMessage(fileData)
            console.log('Message created successfully:', messageData)
            
            // Emit socket message to conversation participants
            if (req.io) {
                req.io.to(req.body.conversationId).emit('new message', messageData)
                console.log('Socket message emitted')
                
                // Update conversation for participants
                const conversation = await Conversation.findById(req.body.conversationId)
                    .populate('participants', 'displayName image')
                    .populate({
                        path: 'lastMessage',
                        populate: { path: 'sender', select: 'displayName image' }
                    });
                
                if (conversation) {
                    conversation.participants.forEach(participant => {             
                        req.io.to(participant._id.toString()).emit('conversation updated', conversation)
                    })
                    console.log('Conversation updated for participants')
                }
            }

            res.status(StatusCodes.CREATED).json({
                message: 'File uploaded successfully!',
                messageData: messageData
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

    getFilesByConversationId: async (req, res) => {
        try {
            const { conversationId } = req.params
            const files = await chatFileService.getFilesByConversationId(conversationId)
            res.status(StatusCodes.OK).json(files)
        } catch (error) {
            console.error('Error getting files:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
                message: 'Error retrieving files',
                error: error.message 
            })
        }
    },

    downloadChatFile: async (req, res) => {
        try {
            const { messageId } = req.params;
            console.log('Downloading chat file for message:', messageId);

            const message = await chatFileService.getMessageById(messageId);
            if (!message) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'Message not found'
                });
            }

            const fileData = JSON.parse(message.file);
            console.log('File data:', fileData);

            // Download file from GCS
            const { buffer, metadata } = await downloadFromGCS(fileData.fileName);
            console.log('File downloaded from GCS, size:', buffer.length);

            // Set appropriate headers
            res.setHeader('Content-Type', fileData.mimeType);
            res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalName}"`);
            res.setHeader('Content-Length', buffer.length);

            // Send file buffer
            res.send(buffer);
        } catch (error) {
            console.error('Error downloading chat file:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Error downloading file',
                error: error.message
            });
        }
    }
}

module.exports = chatFileController 