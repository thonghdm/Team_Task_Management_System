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

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept images, documents, and other common file types
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-rar-compressed',
    'text/plain',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, documents, and common file types are allowed.'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Create middleware instances
const uploadChatFile = upload.single('file');
const uploadChatFileChat = upload.single('file');

// Export configured upload middleware
module.exports = {
  uploadChatFile,
  uploadChatFileChat
};