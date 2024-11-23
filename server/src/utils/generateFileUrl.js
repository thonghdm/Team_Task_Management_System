export const generateFileUrl = (filename) => {
    return process.env.URL_SERVER + `/uploads/files/${filename}`
}
