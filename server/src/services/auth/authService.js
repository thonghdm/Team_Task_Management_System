const User = require('~/models/user') // Import the Mongoose user model
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

// eslint-disable-next-line no-async-promise-executor
const loginSuccessService = (id, tokenLogin) => new Promise(async (resolve, reject) => {
    try {
        const newTokenLogin = uuidv4()
        let user = await User.findOne({ _id: id, tokenLogin }).lean()
        if (user) {
            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '60s' }
            )
            const refreshToken = jwt.sign(
                { id: user._id },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '7d' }
            )

            // Update the user's tokenLogin and refreshToken in the database
            await User.updateOne(
                { _id: id },
                { tokenLogin: newTokenLogin, refreshToken: refreshToken }
            )
            // Resolve the promise with the generated tokens
            resolve({
                err: 0,
                msg: 'OK',
                token,
                refreshToken // Return refresh token to set it as a cookie in the controller
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

            // Verify the refresh token
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err) => {
                if (err) {
                    // Remove the invalid refresh token from the user
                    await User.updateOne({ _id: user._id }, { $unset: { refreshToken: 1 } })
                    return resolve({
                        err: 1,
                        msg: 'Refresh token is expired or invalid'
                    })
                }

                // Generate new tokens
                const newAccessToken = jwt.sign(
                    { id: user._id, email: user.email },
                    process.env.JWT_ACCESS_SECRET,
                    { expiresIn: '60s' }
                )
                const newRefreshToken = jwt.sign(
                    { id: user._id },
                    process.env.JWT_REFRESH_SECRET,
                    { expiresIn: '7d' }
                )
                // Update the user's refresh token in the database
                await User.updateOne({ _id: user._id }, { refreshToken: newRefreshToken })

                resolve({
                    err: 0,
                    msg: 'New tokens generated successfully',
                    token: newAccessToken,
                    refreshToken: newRefreshToken
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


module.exports = {
    loginSuccessService,
    refreshTokenService
}
