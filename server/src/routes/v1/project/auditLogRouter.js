const auditLogController = require('~/controllers/project/auditLogController')
const Router = require('express').Router()

Router.route('/auditLogs')
    .post(auditLogController.createAuditLog)
Router.route('/auditLogs/:task_id')
    .get(auditLogController.getAuditLog)
Router.route('/auditLogs_project')
    .post(auditLogController.createAuditLog_project)
Router.route('/auditLogs_project/:project_id')
    .get(auditLogController.getAuditLog_project)
module.exports = Router