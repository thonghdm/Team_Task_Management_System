const generateFileUrl = (filename) => {
    // If the filename already contains a full URL (from Google Cloud Storage), return it as is
    if (filename.startsWith('https://storage.googleapis.com/')) {
        return filename;
    }
    
    // For backward compatibility with existing files
    return `/uploads/chat/${filename}`;
};

const generateChatFileUrl = (filename) => {
    const baseUrl = process.env.URL_SERVER;
    const url = baseUrl + `/uploads/chat/${filename}`;
    console.log('Generated chat file URL:', url);
    return url;
}

module.exports = { generateFileUrl, generateChatFileUrl }
