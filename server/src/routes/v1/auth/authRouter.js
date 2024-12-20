const router = require('express').Router()
const passport = require('passport')
require('dotenv').config()
const authController = require('~/controllers/Auth/authController')
const authControllerRegister = require('~/controllers/Auth/authControllerRegister')
const verifyToken = require('~/middlewares/verifyToken')

// // Middleware to log requests
// router.use((req, res, next) => {
//     console.log(`Request URL: ${req.originalUrl}, Method: ${req.method}`)
//     next()
// });

// localhost:5000/api/auth/google
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false }))

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, profile) => {
        req.user = profile
        next()
    })(req, res, next)
}, (req, res) => {
    res.redirect(`${process.env.URL_CLIENT}/login-success/${req.user?.id}/${req.user.tokenLogin}`)
})

router.post('/refresh', authController.requestAccessToken)

router.post('/login-success', authController.loginSuccess)

router.post('/email-login', authControllerRegister.loginUser)

router.post('/email-register', authControllerRegister.registerUser)
router.post('/resend-otp', authControllerRegister.resendOTP)
router.post('/verify-email', authControllerRegister.verifyEmail)
router.get('/get-user', verifyToken, authController.getUser)
router.get('/logout', authController.logout)
router.post('/otp-reset-password', authController.resetPasswordOTP)
module.exports = router