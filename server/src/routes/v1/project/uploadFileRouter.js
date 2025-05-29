const uploadFileController = require('~/controllers/project/uploadFileController')
const { uploadChatFile } = require('~/middlewares/uploadFile')
const verifyToken = require('~/middlewares/verifyToken')
const Router = require('express').Router()

Router.route('/upload-file')
    .post(verifyToken, uploadChatFile, uploadFileController.uploadFile)

Router.route('/files/:id/download')
    .get(verifyToken, uploadFileController.downloadFile)

Router.route('/tasks/:taskId/files')
    .get(verifyToken, uploadFileController.getFilesByTaskId)

Router.route('/attachments/:id')
    .put(verifyToken, uploadFileController.updateAttachment)
    .delete(verifyToken, uploadFileController.deleteFile)

module.exports = Router