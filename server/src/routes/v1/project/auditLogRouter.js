const auditLogController = require('~/controllers/project/auditLogController')
const Router = require('express').Router()

Router.route('/auditLogs')
    .post(auditLogController.createAuditLog)
Router.route('/auditLogs/:task_id')
    .get(auditLogController.getAuditLog)
module.exports = Router