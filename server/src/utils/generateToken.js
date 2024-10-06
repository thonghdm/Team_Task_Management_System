const jwt = require('jsonwebtoken')

const generateAccessToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15s' })
}
const generateRefreshToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '60s' })
}

exports.generateAccessToken = generateAccessToken
exports.generateRefreshToken = generateRefreshToken