const getRelativeSrcPath = (fullPath) => {
    const srcIndex = fullPath.indexOf('src');
    return srcIndex !== -1 ? fullPath.substring(srcIndex).replace(/\\/g, '/') : fullPath;
};

const getChatFileUrl = (fullPath) => {
    // For chat files, we need to get just the filename from the uploads/chat directory
    const chatIndex = fullPath.indexOf('uploads/chat');
    if (chatIndex !== -1) {
        // Extract everything after "uploads/chat/"
        const relativePath = fullPath.substring(chatIndex).replace(/\\/g, '/');
        return relativePath;
    }
    
    // Fallback: if uploads/chat not found, try to extract just filename
    const filename = fullPath.split(/[\\\/]/).pop();
    return `uploads/chat/${filename}`;
};

module.exports = { getRelativeSrcPath, getChatFileUrl };