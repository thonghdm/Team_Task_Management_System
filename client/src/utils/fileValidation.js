import { toast } from 'react-toastify';

// Define file size limits
export const FILE_SIZE_LIMITS = {
    CHAT_FILES: 10 * 1024 * 1024, // 10MB
    PROJECT_FILES: 10 * 1024 * 1024, // 10MB  
    GROUP_AVATAR: 5 * 1024 * 1024, // 5MB
    CLOUDINARY_IMAGES: 2 * 1024 * 1024, // 2MB
};

// Define allowed file types
export const ALLOWED_FILE_TYPES = {
    CHAT_FILES: [
        'image/jpeg',
        'image/jpg', 
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
    ],
    PROJECT_FILES: [
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
    ],
    IMAGES_ONLY: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif'
    ]
};

// Format file size for display
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generic file validation function
export const validateFile = (file, options = {}) => {
    const {
        maxSize = FILE_SIZE_LIMITS.PROJECT_FILES,
        allowedTypes = ALLOWED_FILE_TYPES.PROJECT_FILES,
        showToast = true,
        context = 'file'
    } = options;

    // Check if file exists
    if (!file) {
        if (showToast) toast.error('No file selected');
        return {
            isValid: false,
            error: 'No file selected'
        };
    }

    // Check file size
    if (file.size > maxSize) {
        const errorMsg = `File size exceeds ${formatFileSize(maxSize)} limit. Current size: ${formatFileSize(file.size)}`;
        if (showToast) toast.error(errorMsg);
        return {
            isValid: false,
            error: errorMsg
        };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
        const errorMsg = `File type not supported for ${context}. Please upload supported file types.`;
        if (showToast) toast.error(errorMsg);
        return {
            isValid: false,
            error: errorMsg
        };
    }

    // Check file name length
    if (file.name.length > 255) {
        const errorMsg = 'File name is too long. Maximum 255 characters allowed';
        if (showToast) toast.error(errorMsg);
        return {
            isValid: false,
            error: errorMsg
        };
    }

    // Check for empty files
    if (file.size === 0) {
        const errorMsg = 'Cannot upload empty files';
        if (showToast) toast.error(errorMsg);
        return {
            isValid: false,
            error: errorMsg
        };
    }

    return {
        isValid: true,
        fileInfo: {
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type
        }
    };
};

// Specific validation functions for different contexts
export const validateChatFile = (file, showToast = true) => {
    return validateFile(file, {
        maxSize: FILE_SIZE_LIMITS.CHAT_FILES,
        allowedTypes: ALLOWED_FILE_TYPES.CHAT_FILES,
        showToast,
        context: 'chat'
    });
};

export const validateProjectFile = (file, showToast = true) => {
    return validateFile(file, {
        maxSize: FILE_SIZE_LIMITS.PROJECT_FILES,
        allowedTypes: ALLOWED_FILE_TYPES.PROJECT_FILES,
        showToast,
        context: 'project'
    });
};

export const validateImageFile = (file, showToast = true) => {
    return validateFile(file, {
        maxSize: FILE_SIZE_LIMITS.GROUP_AVATAR,
        allowedTypes: ALLOWED_FILE_TYPES.IMAGES_ONLY,
        showToast,
        context: 'image'
    });
};

// Get file extension from filename
export const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

// Check if file is an image
export const isImageFile = (file) => {
    return ALLOWED_FILE_TYPES.IMAGES_ONLY.includes(file.type);
};

// Generate preview URL for images
export const generateImagePreview = (file) => {
    if (!isImageFile(file)) return null;
    return URL.createObjectURL(file);
}; 