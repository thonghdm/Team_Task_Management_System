/* eslint-disable no-console */
const User = require('~/models/user') // Import the Mongoose user model
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const token = require('~/utils/generateToken')
require('dotenv').config()


const authServiceRegister = {
    loginUser: async (userData) => {
        try {
            const user = await User.findOne({ email: userData.email })
            if (!user) throw new Error('Incorrect displayName')
            const validPassword = await bcrypt.compare(userData.password, user.password)
            if (!validPassword) throw new Error('Incorrect password')
            // Generate tokens
            const accessToken = token.generateAccessToken(user._id)
            const refreshToken = token.generateRefreshToken(user._id)
            // lưu refreshToken vào database
            user.refreshToken = refreshToken
            await user.save()
            // eslint-disable-next-line no-unused-vars
            const { password, ...userDataWithoutPassword } = user._doc
            return {
                accessToken,
                refreshToken,
                userData: userDataWithoutPassword
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
            console.log(userData)
            if (existingUser) {
                return { error: 'Email already exists' }
            }

            const salt = await bcrypt.genSalt(10)
            const hashed = await bcrypt.hash(userData.password, salt)

            const newUser = new User({
                displayName: userData.name,
                email: userData.email,
                password: hashed
            })

            const savedUser = await newUser.save()
            // eslint-disable-next-line no-unused-vars
            const { password, ...userWithoutPassword } = savedUser._doc

            return { user: userWithoutPassword }
        } catch (error) {
            console.error('Registration error:', error)
            return { error: 'An error occurred during registration' }
        }
    }
}

module.exports = authServiceRegister
