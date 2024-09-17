const authServiceRegister = require('../../services/auth/authServiceRegister')

const authControllerRegister = {
    loginUser: async (req, res) => {
        try {
            const result = await authServiceRegister.loginUser(req.body)
            if (result.error) {
                return res.status(400).json({ error: result.error })
            }
            const { accessToken, refreshToken, userData } = result
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict'
            })
            const userWithToken = { ...userData, accessToken }


            res.status(200).json({
                userWithToken
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
    }
}

module.exports = authControllerRegister