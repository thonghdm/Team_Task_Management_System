const User = require('~/models/user') // Import the Mongoose user model
const jwt = require('jsonwebtoken')
const token = require('~/utils/generateToken')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

// eslint-disable-next-line no-async-promise-executor
const loginSuccessService = (id, tokenLogin) => new Promise(async (resolve, reject) => {
    try {
        const newTokenLogin = uuidv4()
        let user = await User.findOne({ _id: id, tokenLogin }).lean()
        if (user) {

            const accesstoken = token.generateAccessToken(user._id)
            const refreshToken = token.generateRefreshToken(user._id)

            await User.updateOne(
                { _id: id },
                { tokenLogin: newTokenLogin, refreshToken: refreshToken }
            )
            resolve({
                err: 0,
                msg: 'OK',
                accesstoken,
                refreshToken
            })
        } else {
            resolve({
                err: 3,
                msg: 'User not found or failed to login!',
                token: null,
                refreshToken: null
            })
        }
    } catch (error) {
        reject({
            err: 2,
            msg: 'Fail at auth service: ' + error.message
        })
    }
})


const refreshTokenService = (refreshToken) => new Promise((resolve, reject) => {
    (async () => {
        try {
            const user = await User.findOne({ refreshToken })
            if (!user) {
                return resolve({
                    err: 1,
                    msg: 'Refresh token is not valid'
                })
            }
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err) => {
                if (err) {
                    // Remove the invalid refresh token from the user
                    await User.updateOne({ _id: user._id }, { $unset: { refreshToken: 1 } })
                    return resolve({
                        err: 1,
                        msg: 'Refresh token is expired or invalid'
                    })
                }

                const newAccessToken = jwt.sign(
                    { id: user._id, email: user.email },
                    process.env.JWT_ACCESS_SECRET,
                    { expiresIn: '1d' }
                )

                resolve({
                    err: 0,
                    msg: 'New tokens generated successfully',
                    token: newAccessToken,
                    refreshToken
                })
            })
        } catch (error) {
            reject({
                err: -1,
                msg: 'Fail at refresh token service: ' + error.message
            })
        }
    })()
})
const getUserService = (id) => new Promise((resolve, reject) => {
    try {
        const user = User
            .findOne({ _id: id })
            .select('-password')
            .lean()
        resolve(user)
    } catch (error) {
        reject(error)
    }
}
)
module.exports = {
    loginSuccessService,
    refreshTokenService,
    getUserService
}

