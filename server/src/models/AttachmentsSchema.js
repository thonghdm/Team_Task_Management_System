const mongoose = require('mongoose')

const AttachmentsSchema = new mongoose.Schema({
    originalName: String, // Tên file gốc
    fileName: String, // Tên file được generate     url: String, // URL hoặc path của file đã lưu
    mimeType: String, // Loại file (image/jpeg, application/pdf, ...)
    url: String, // URL hoặc path của file đã lưu
    size: Number, // Kích thước file (bytes)
    entityId: {
        type: mongoose.Schema.Types.ObjectId, // ID của đối tượng liên quan
        refPath: 'entityType'
    }, // ID của entity liên kết
    entityType: {
        type: String,
        enum: ['Task', 'Chat', 'Project']
    }, // Loại entity liên kết
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    is_active: { type: Boolean, default: true }
}, {
    timestamps: true
}
)

module.exports = mongoose.model('Attachments', AttachmentsSchema)
