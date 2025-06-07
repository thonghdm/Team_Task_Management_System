const authService = require('~/services/auth/authService')
const authController = {
    resetPasswordOTP: async (req, res) => {
        try {
            const { email } = req.body
            console.log(email)
            if (!email) {
                return res.status(400).json({
                    err: 1,
                    msg: 'Missing inputs'
                })
            }
            let response = await authService.resetPasswordOTPService(email)
            console.log(response)
            res.status(200).json({
                err: response.err,
                msg: response.msg
            })
        } catch (error) {
            res.status(500).json({
                err: -1,
                msg: 'Fail at reset password: ' + error.message
            })
        }
    },
    loginSuccess: async (req, res) => {
        const { id, tokenLogin } = req.body
        try {
            if (!id || !tokenLogin) {
                return res.status(400).json({
                    err: 1,
                    msg: 'Missing inputs'
                })
            }

            let response = await authService.loginSuccessService(id, tokenLogin)
            if (response.accesstoken && response.refreshToken) {
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
                accesstoken: response.accesstoken || null,
                is_active: response.is_active || null,
                isAdmin: response.isAdmin ?? null
            })

        } catch (error) {
            res.status(500).json({
                err: -1,
                msg: 'Fail at auth controller: ' + error.message
            })
        }
    },
    requestAccessToken: async (req, res) => {
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
                    token: response.token || null,
                    userData: response.userData || null

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
    },
    logout: async (req, res) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(401).json({
                err: 1,
                msg: 'You re not authenticated'
            })
        }
        try {
            let response = await authService.logoutService(refreshToken)
            if (response.err === 0) {
                res.clearCookie('refreshToken', {
                    httpOnly: true,
                    path: '/',
                    sameSite: 'strict',
                    secure: (process.env.URL_CLIENT === 'http://localhost:3000') ? false : true,
                })
                res.status(200).json({
                    err: 0,
                    msg: 'Logout successful'
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
                msg: 'Fail at logout: ' + error.message
            })
        }
    },
    getUser: async (req, res) => {
        try {
            const userId = req.body._id
            const user = await authService.getUserService(userId)
            if (!user) {
                return res.status(404).json({
                    err: 1,
                    msg: 'User not found'
                })
            }

            res.status(200).json({
                err: 0,
                msg: 'Success',
                data: user
            })
        } catch (error) {
            res.status(500).json({
                err: -1,
                msg: 'Fail at get user: ' + error.message
            })
        }
    }
}

module.exports = authController