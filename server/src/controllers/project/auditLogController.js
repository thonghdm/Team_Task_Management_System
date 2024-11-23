const auditLogServices = require('~/services/project/auditLogService')
const { StatusCodes } = require('http-status-codes')

const auditLogController = {
    getAuditLog: async (req, res, next) => {
        const { task_id } = req.params
        try {
            const auditLog = await auditLogServices.getAuditLog(task_id)
            res.status(StatusCodes.OK).json({
                auditLog,
                message: 'Successfully retrieved audit log.'
            })
        } catch (error) {
            next(error)
        }
    },
    createAuditLog: async (req, res, next) => {
        try {
            const createAuditLog = await auditLogServices.createAuditLog(req.body)
            res.status(StatusCodes.CREATED).json({
                message: 'Audit log created successfully!',
                auditLog: createAuditLog
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = auditLogController
