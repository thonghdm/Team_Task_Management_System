const User = require('~/models/user') // Import the Mongoose user model
const jwt = require('jsonwebtoken')
const token = require('~/utils/generateToken')
const { v4: uuidv4 } = require('uuid')
import sendEmail from '~/utils/sendEmail'
import generateOTP from '~/utils/generateOTP'

require('dotenv').config()

// eslint-disable-next-line no-async-promise-executor
const loginSuccessService = (id, tokenLogin) => new Promise(async (resolve, reject) => {
    try {
        const newTokenLogin = uuidv4()
        let user = await User.findOne({ _id: id, tokenLogin }).lean()
        if (user) {

            const accesstoken = token.generateAccessToken(user._id, user.email)
            const refreshToken = token.generateRefreshToken(user._id, user.email)

            await User.updateOne(
                { _id: id },
                { tokenLogin: newTokenLogin, refreshToken: refreshToken }
            )
            resolve({
                err: 0,
                msg: 'OK',
                accesstoken,
                refreshToken,
                is_active: user?.is_active,
                isAdmin: user?.isAdmin
            })
        } else {
            resolve({
                err: 3,
                msg: 'User not found or failed to login!',
                accesstoken: null,
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

                const newAccessToken = token.generateAccessToken(user._id, user.email)
                resolve({
                    err: 0,
                    msg: 'New tokens generated successfully',
                    token: newAccessToken,
                    refreshToken,
                    userData: user
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
})
const resetPasswordOTPService = (email) => new Promise((resolve, reject) => {
    (async () => {
        try {
            const user = await User.findOne({ email })
            console.log(user)
            if (!user) {
                return resolve({
                    err: 1,
                    msg: 'Email not found'
                })
            }
            const otp = generateOTP()
            user.otp_code = otp
            user.otp_expired = new Date(Date.now() + 600000) // 60s
            user.otp_type = 'reset_password'
            await user.save()
            await sendEmail({
                email: user.email,
                subject: 'OTP Verification',
                message: `Your OTP code is ${otp}`
            })
            resolve({
                err: 0,
                msg: 'OK',
                otp
            })
        } catch (error) {
            reject({
                err: -1,
                msg: 'Fail at reset password service: ' + error.message
            })
        }
    })()
})
const logoutService = (refreshToken) => new Promise((resolve, reject) => {
    (async () => {
        try {//Xóa refreshToken khỏi db
            await User.findOneAndUpdate({ refreshToken }, { refreshToken: '' }, { new: true })
            resolve({
                err: 0,
                msg: 'Logout successful'
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
    refreshTokenService,
    getUserService,
    logoutService,
    resetPasswordOTPService
}

