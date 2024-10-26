import cloudinaryPackage from 'cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import path from 'path'

// Load environment variables
dotenv.config()

// Initialize Cloudinary
const cloudinary = cloudinaryPackage.v2
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
})

// Allowed file types
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png']
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

// Create Cloudinary storage configuration
const storage = new CloudinaryStorage({
    cloudinary
})

// File filter function
const fileFilter = (req, file, cb) => {
    // Check file type
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed!'), false)
    }

    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase()
    if (!ALLOWED_FORMATS.includes(ext.substring(1))) {
        return cb(new Error(`Allowed formats: ${ALLOWED_FORMATS.join(', ')}`), false)
    }

    cb(null, true)
}

// Configure multer upload
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE
    }
})

// Helper function to handle file upload with error handling
export const handleUpload = (req, res) => {
    return new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // Multer error (e.g., file too large)
                reject({
                    status: 400,
                    message: `Upload error: ${err.message}`
                })
            } else if (err) {
                // Other errors
                reject({
                    status: 400,
                    message: err.message
                })
            }
            resolve(req.file)
        })
    })
}

// Upload file to Cloudinary
export const uploadToCloudinary = async (file) => {
    try {
        if (!file) {
            throw new Error('No file provided')
        }

        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: 'auto',
            folder: 'ProfileImages_API'
        })

        return {
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format
        }
    } catch (error) {
        throw new Error(`Cloudinary upload failed: ${error.message}`)
    }
}

// Delete file from Cloudinary
export const deleteFromCloudinary = async (imageUrl) => {
    try {
        if (!imageUrl) {
            return null
        }

        // Extract public_id from URL
        const urlParts = imageUrl.split('/')
        const publicIdWithExtension = urlParts[urlParts.length - 1]
        const publicId = `ProfileImages_API/${publicIdWithExtension.split('.')[0]}`

        const result = await cloudinary.uploader.destroy(publicId)
        return result
    } catch (error) {
        throw new Error(`Failed to delete from Cloudinary: ${error.message}`)
    }
}

// Utility function to validate file size before upload
export const validateFileSize = (file, maxSize = MAX_FILE_SIZE) => {
    if (file.size > maxSize) {
        throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`)
    }
    return true
}