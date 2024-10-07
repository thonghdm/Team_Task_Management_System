const jwt = require('jsonwebtoken')

const generateAccessToken = (_id, email) => {
    return jwt.sign({ _id, email }, process.env.JWT_ACCESS_SECRET, { expiresIn: '2d' })
}
const generateRefreshToken = (_id, email) => {
    return jwt.sign({ _id, email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

exports.generateAccessToken = generateAccessToken
exports.generateRefreshToken = generateRefreshToken