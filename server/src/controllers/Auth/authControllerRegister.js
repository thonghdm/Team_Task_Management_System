const authServiceRegister = require('../../services/auth/authServiceRegister')

const authControllerRegister = {
    loginUser: async (req, res) => {
        try {
            const result = await authServiceRegister.loginUser(req.body)
            if (result.error) {
                return res.status(400).json({ error: result.error })
            }
            const { accessToken, refreshToken, userData } = result

            const isProduction = process.env.NODE_ENV === 'production'

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: isProduction,
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                sameSite: isProduction ? 'none' : 'strict'
            })
            const userWithToken = { ...userData, accessToken }


            res.status(200).json({
                userWithToken,
                message: 'Login successful'
            })
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' })
        }
    },
    registerUser: async (req, res) => {
        try {
            const result = await authServiceRegister.registerUser(req.body)
            if (result.error) {
                return res.status(400).json({ error: result.error })
            }
            res.status(201).json(result.user)
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Registration controller error:', err)
            res.status(500).json({ error: 'Internal server error' })
        }
    },
    resendOTP: async (req, res) => {
        try {
            const result = await authServiceRegister.resendOTP(req.body)
            if (result.error) {
                return res.status(400).json({ error: result.error })
            }
            res.status(200).json(result)
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' })
        }
    },
    verifyEmail: async (req, res) => {
        try {
            const result = await authServiceRegister.verifyEmail(req.body)
            console.log('resulttt', result)
            if (result.error) {
                return res.status(400).json({ error: result.error })
            }
            res.status(200).json(result)
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' })
        }
    }
}

module.exports = authControllerRegister