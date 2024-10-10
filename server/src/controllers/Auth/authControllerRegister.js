const authServiceRegister = require('../../services/auth/authServiceRegister')

const authControllerRegister = {
    loginUser: async (req, res) => {
        try {
            const result = await authServiceRegister.loginUser(req.body)
            if (result.error) {
                return res.status(400).json({ error: result.error })
            }
            const { accessToken, refreshToken, userData } = result
            if (accessToken && refreshToken) {
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    path: '/',
                    sameSite: 'strict', // CSRF protection
                    maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
                })
            }
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
    }
}

module.exports = authControllerRegister