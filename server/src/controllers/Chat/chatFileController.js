const chatFileService = require('~/services/chat/chatFileService')
const { StatusCodes } = require('http-status-codes')
const fs = require('fs')
const Conversation = require('~/models/ConversationSchema')

const chatFileController = {
    uploadChatFile: async (req, res, next) => {
        console.log('uploadChatFile controller - req.body:', req.body);
        console.log('uploadChatFile controller - req.file:', req.file);
        try {
            if (!req.file) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'No file uploaded!'
                })
            }

            if (!req.body.conversationId || !req.body.uploadedBy) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Missing required fields: conversationId and uploadedBy'
                })
            }

            const fileData = {
                originalName: req.file.originalname,
                fileName: req.file.filename,
                mimeType: req.file.mimetype,
                size: req.file.size,
                uploadedBy: req.body.uploadedBy,
                conversationId: req.body.conversationId
            }

            console.log('fileData before service:', fileData);

            const messageData = await chatFileService.createFileMessage(fileData)
            console.log('messageData:::::::::', messageData)
            // Emit socket message to conversation participants
            if (req.io) {
                req.io.to(req.body.conversationId).emit('new message', messageData)
                console.log('messageData:::::::::', messageData)
                // Update conversation for participants
                const conversation = await Conversation.findById(req.body.conversationId)
                    .populate('participants', 'displayName image')
                    .populate({
                        path: 'lastMessage',
                        populate: { path: 'sender', select: 'displayName image' }
                    });
                console.log('conversation:::::', conversation)
                if (conversation) {
                    conversation.participants.forEach(participant => {             
                            req.io.to(participant._id.toString()).emit('conversation updated', conversation)
                    })
                }
            }

            res.status(StatusCodes.CREATED).json({
                message: 'File uploaded successfully!',
                messageData: messageData
            })
        } catch (error) {
            console.error('Upload file error:', error);
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting file:', err)
                })
            }
            next(error)
        }
    },

    getFilesByConversationId: async (req, res) => {
        try {
            const { conversationId } = req.params
            const files = await chatFileService.getFilesByConversationId(conversationId)
            res.status(StatusCodes.OK).json(files)
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }
}

module.exports = chatFileController 