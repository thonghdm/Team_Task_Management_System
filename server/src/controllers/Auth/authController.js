const authService = require('~/services/auth/authService')


const authController = {
    loginSuccess: async (req, res) => {
        const { id, tokenLogin } = req.body
        console.log('id', 1)
        try {
            if (!id || !tokenLogin) {
                return res.status(400).json({
                    err: 1,
                    msg: 'Missing inputs'
                })
            }

            let response = await authService.loginSuccessService(id, tokenLogin)
            if (response.token && response.refreshToken) {
                res.cookie('refreshToken', response.refreshToken, {
                    httpOnly: true,
                    path: '/',
                    sameSite: 'strict', // CSRF protection
                    maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
                })

            }
            res.status(200).json({
                err: response.err,
                msg: response.msg,
                token: response.token || null
            })

        } catch (error) {
            res.status(500).json({
                err: -1,
                msg: 'Fail at auth controller: ' + error.message
            })
        }
    },

    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(401).json({
                err: 1,
                msg: 'You re not authenticated'
            })
        }

        try {
            let response = await authService.refreshTokenService(refreshToken)
            if (response.token && response.refreshToken) {
                res.cookie('refreshToken', response.refreshToken, {
                    httpOnly: true,
                    path: '/',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })
                res.status(200).json({
                    err: 0,
                    msg: 'New tokens generated successfully',
                    token: response.token || null
                })
            } else {
                res.status(403).json({
                    err: 3,
                    msg: response.msg
                })
            }
        } catch (error) {
            res.status(500).json({
                err: -1,
                msg: 'Fail at refresh token: ' + error.message
            })
        }
    }
}

module.exports = authController