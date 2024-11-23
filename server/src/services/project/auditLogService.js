const Task = require('~/models/TaskSchema')
const AuditLog = require('~/models/AuditLogSchema')

const createAuditLog = async (reqBody) => {
    try {
        const newAuditLogData = {
            ...reqBody
        }
        const newAuditLog = new AuditLog(newAuditLogData)
        const createdAuditLog = await newAuditLog.save()
        const getNewAuditLog = await AuditLog.findById(createdAuditLog._id)
        if (getNewAuditLog) {
            await addAuditLogToTask(getNewAuditLog)
        }
        return createdAuditLog
    } catch (error) {
        throw new Error(error)
    }
}
const addAuditLogToTask = async (auditLog) => {
    try {
        const updatedDocument = await Task.findOneAndUpdate(
            { _id: auditLog.task_id },
            { $push: { audit_log_id: auditLog._id } },
            { returnDocument: 'after' }
        )
        return updatedDocument
    } catch (error) {
        throw new Error(`Error adding auditLog to task: ${error.message}`)
    }
}
const getAuditLog = async (task_id) => {
    try {
        const auditLog = await AuditLog.find({ task_id: task_id })
            .populate('user_id', 'displayName email image')
        return auditLog
    }
    catch (error) {
        throw new Error(`Error getting auditLog: ${error.message}`)
    }
}
module.exports = { createAuditLog, addAuditLogToTask, getAuditLog }