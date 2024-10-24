const cloudinaryPackage = require('cloudinary')
const multer = require('multer')
const dotenv = require('dotenv')

dotenv.config()
const { CloudinaryStorage } = require('multer-storage-cloudinary')
//configure cloudinary
const cloudinary = cloudinaryPackage.v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
})

// Create storage engine for Multer
const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png', 'jpeg', 'PNG', 'JPG', 'JPEG'],
    params: {
        folder: 'ProfileImages_API'
    }
})

// Init Multer with the storage engine
export const upload = multer({ storage: storage })
