/* eslint-disable no-console */
const User = require('~/models/user') // Import the Mongoose user model
const bcrypt = require('bcrypt')
const token = require('~/utils/generateToken')
import { generateUniqueUsername } from '~/utils/convertToUsername'
import sendEmail from '~/utils/sendEmail'
import generateOTP from '~/utils/generateOTP'
require('dotenv').config()

const getUsernameData = async () => {
    try {
        const users = await User.find({}, 'username') // Truy vấn chỉ lấy trường username
        return users.map(user => user.username) // Trả về mảng username
    } catch (error) {
        console.error('Error fetching usernames:', error)
        return [] // Trả về mảng rỗng nếu có lỗi
    }
}
const isValidName = (name) => {
    // Chỉ cho phép các ký tự chữ cái và độ dài 3-255
    const nameRegex = /^[^\d_!@#$%^&*()=+[\]{};':"|,.<>?~`]{3,255}$/
    return nameRegex.test(name)
}
const isStrongPassword = (password) => {
    // Kiểm tra độ dài tối thiểu
    const hasMinimumLength = password.length >= 8
    // Kiểm tra chữ hoa
    const hasUpperCase = /[A-Z]/.test(password)
    // Kiểm tra chữ thường
    const hasLowerCase = /[a-z]/.test(password)
    // Kiểm tra ký tự số
    const hasNumber = /\d/.test(password)
    // Kiểm tra ký tự đặc biệt
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return hasMinimumLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
}
const authServiceRegister = {
    loginUser: async (userData) => {
        try {
            const user = await User.findOne({ email: userData.email })
            if (!user) throw new Error('Incorrect displayName')
            const validPassword = await bcrypt.compare(userData.password, user.password)
            if (!validPassword) throw new Error('Incorrect password')
            // Generate tokens
            const accessToken = token.generateAccessToken(user._id, user.email)
            const refreshToken = token.generateRefreshToken(user._id, user.email)
            // lưu refreshToken vào database
            user.refreshToken = refreshToken
            await user.save()
            // eslint-disable-next-line no-unused-vars
            const { password, otp_code, ...userDataWithoutPasswordOTP } = user._doc
            return {
                accessToken,
                refreshToken,
                userData: userDataWithoutPasswordOTP
            }}
        catch (error) {
            console.error('Login error:', error)
            return { error: 'An error occurred during login' }
        }
    },
    registerUser: async (userData) => {
        try {
            // Check if email already exists
            const existingUser = await User.findOne({ email: userData.email })
            console.log(existingUser)
            if (existingUser&&existingUser.password) {
                console.log('Email already exists')
                return { error: 'Email already exists' }
            }
            if (!userData.password) {
                console.log('Password is required')
                return { error: 'Password is required' }
            }
            if (!isStrongPassword(userData.password)) {
                console.log('Weak password')
                return { error: 'Password is too weak' }
            }
            const salt = await bcrypt.genSalt(10)
            const hashed = await bcrypt.hash(userData.password, salt)
            if (existingUser)
            {
                existingUser.password = hashed
                await existingUser.save()
                return { user: existingUser }
            }
            if (!isValidName(userData.name)) {
                console.log('Invalid name')
                return { error: 'Invalid name' }
            }
            const otp = generateOTP()
            const usernameData = await getUsernameData()
            const username = generateUniqueUsername(userData.name, usernameData)
            const newUser = new User({
                displayName: userData.name,
                email: userData.email,
                password: hashed,
                username: username,
                otp_code: otp,
                otp_expired: new Date(Date.now() + 60000) // 60s
            })

            const savedUser = await newUser.save()
            // eslint-disable-next-line no-unused-vars
            const { password, otp_code, ...userWithoutPasswordOTP } = savedUser._doc
            const emailOptions = {
                email: savedUser.email, // Địa chỉ email người nhận
                subject: 'OTP Verification', // Tiêu đề email
                message: `Your OTP code is ${otp}` // Nội dung email
            }
            try {
                await sendEmail(emailOptions)
                console.log('Email sent successfully!')
            } catch (error) {
                console.error('Error sending email:', error)
            }
            return { user: userWithoutPasswordOTP }
        } catch (error) {
            console.error('Registration error:', error)
            return { error: 'An error occurred during registration' }
        }
    },
    resendOTP: async (userData) => {
        try {
            const user = await User.findOneAndUpdate(
                { email: userData.email },
                { otp_code: generateOTP(), otp_expired: new Date(Date.now() + 60000) },
                { new: true }
            )
            if (!user) {
                return { error: 'User not found' }
            }
            const emailOptions = {
                email: user.email,
                subject: 'OTP Verification',
                message: `Your OTP code is ${user.otp_code}`
            }
            try {
                await sendEmail(emailOptions)
                console.log('Email sent successfully!')
            } catch (error) {
                console.error('Error sending email:', error)
            }
            // eslint-disable-next-line no-unused-vars
            const { password, otp_code, ...userWithoutPasswordOTP } = user._doc
            return { user: userWithoutPasswordOTP }
        } catch (error) {
            console.error('Resend OTP error:', error)
            return { error: 'An error occurred during OTP resend' }
        }
    },
    verifyEmail: async (userData) => {
        try {
            const user = await User.findOne({ email: userData.email })
            if (!user) {
                return { error: 'User not found' }
            }
            const OTPExpired = new Date() > new Date(user.otp_expired)
            if (user.otp_code !== userData.otp_code || OTPExpired) {
                return { error: 'Invalid OTP code' }
            }
            if (user.is_verified) {
                return { error: 'Email already verified' }
            }
            user.otp_code = ''
            user.otp_expired = ''
            user.is_verified = true
            await user.save()
            // eslint-disable-next-line no-unused-vars
            const { password, otp_code, ...userWithoutPasswordOTP } = user._doc
            return { user: userWithoutPasswordOTP }
        } catch (error) {
            console.error('Verify email error:', error)
            return { error: 'An error occurred during email verification' }
        }
    }
}

module.exports = authServiceRegister
