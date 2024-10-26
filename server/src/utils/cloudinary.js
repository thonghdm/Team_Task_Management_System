import cloudinaryPackage from 'cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

dotenv.config()

// Configure cloudinary
const cloudinary = cloudinaryPackage.v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
})

// Create storage engine for Multer with more options
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'ProfileImages_API',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{
            width: 500,
            height: 500,
            crop: 'limit'
        }],
        // Tạo tên file unique
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            return `profile-${uniqueSuffix}`
        }
    },
    // Kiểm tra file trước khi upload
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Chỉ cho phép upload file ảnh!'), false)
        }
        cb(null, true)
    }
})

// Init Multer với cấu hình storage và giới hạn
export const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 2 // Giới hạn 2MB
    }
})

// Helper function để xóa ảnh
export const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        return result
    } catch (error) {
        throw new Error('Lỗi khi xóa ảnh từ Cloudinary')
    }
}

// Helper function để lấy public_id từ url
export const getPublicIdFromUrl = (url) => {
    try {
        const parts = url.split('/')
        const fileName = parts[parts.length - 1]
        const publicId = fileName.split('.')[0]
        return publicId
    } catch (error) {
        return null
    }
}