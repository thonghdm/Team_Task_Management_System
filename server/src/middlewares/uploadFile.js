const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Định nghĩa đường dẫn upload
const srcDir = path.resolve(__dirname + '/..')
// Định nghĩa đường dẫn upload từ src
const uploadDir = path.join(srcDir, 'uploads', 'projects')
const chatUploadDir = path.join(srcDir, 'uploads', 'chat')

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

if (!fs.existsSync(chatUploadDir)) {
    fs.mkdirSync(chatUploadDir, { recursive: true })
}

// Cấu hình storage cho multer  (lưu trữ file project)
const chatFileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

// Cấu hình storage cho chat files
const chatFileStorageChat = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, chatUploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

// File filter
const chatFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|zip|rar|txt|pptx/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    if (extname) {
        return cb(null, true)
    }
    cb(new Error('Error: File type not allowed! Allowed types: images, documents, archives'))
}

// Cấu hình multer cho project files
const uploadChatFile = multer({
    storage: chatFileStorage,
    limits: {
        fileSize: 25 * 1024 * 1024 // 25MB
    },
    fileFilter: chatFileFilter
});

// Cấu hình multer cho chat files  
const uploadChatFileChat = multer({
    storage: chatFileStorageChat,
    limits: {
        fileSize: 25 * 1024 * 1024 // 25MB
    },
    fileFilter: chatFileFilter
});

export { uploadChatFile, uploadChatFileChat }