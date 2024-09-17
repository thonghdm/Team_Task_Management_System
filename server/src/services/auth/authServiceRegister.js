/* eslint-disable no-console */
const User = require('~/models/user') // Import the Mongoose user model
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()


const authServiceRegister = {
    // GENERATE ACCESS TOKEN
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '1d' }
        )
    },

    // GENERATE REFRESH TOKEN
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        )
    },
    loginUser: async (userData) => {
        const user = await User.findOne({ email: userData.email })
        if (!user) throw new Error('Incorrect displayName')
        const validPassword = await bcrypt.compare(userData.password, user.password)
        if (!validPassword) throw new Error('Incorrect password')
        // Generate tokens
        const accessToken = authServiceRegister.generateAccessToken(user)
        const refreshToken = authServiceRegister.generateRefreshToken(user)
        // eslint-disable-next-line no-unused-vars
        const { password, ...userDataWithoutPassword } = user._doc
        return {
            accessToken,
            refreshToken,
            userData: userDataWithoutPassword
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
