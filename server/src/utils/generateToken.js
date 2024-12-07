const jwt = require('jsonwebtoken')

const generateAccessToken = (_id, email) => {
    return jwt.sign({ _id, email }, process.env.JWT_ACCESS_SECRET, { expiresIn: '10s' })
}
const generateRefreshToken = (_id, email) => {
    return jwt.sign({ _id, email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '3d' })
}

exports.generateAccessToken = generateAccessToken
exports.generateRefreshToken = generateRefreshToken