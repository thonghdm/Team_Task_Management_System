const generateFileUrl = (filename) => {
    return process.env.URL_SERVER + `/uploads/files/${filename}`
}

const generateChatFileUrl = (filename) => {
    const baseUrl = process.env.URL_SERVER || 'http://localhost:5000';
    const url = baseUrl + `/uploads/chat/${filename}`;
    console.log('Generated chat file URL:', url);
    return url;
}

module.exports = { generateFileUrl, generateChatFileUrl }
