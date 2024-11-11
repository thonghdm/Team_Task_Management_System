
const uploadFileController = require('~/controllers/project/uploadFileController')
const { uploadChatFile } = require('~/middlewares/uploadFile')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

Router.route('/upload-file')
    .post(verifyToken, uploadChatFile.single('file'), uploadFileController.uploadFile)

Router.route('/attachments/:id')
    .put(verifyToken, uploadFileController.updateAttachment)


Router.route('/tasks/:taskId/files')
    .get(verifyToken, uploadFileController.getFilesByTaskId)

module.exports = Router