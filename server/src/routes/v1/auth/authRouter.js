const router = require('express').Router()
const passport = require('passport')
require('dotenv').config()
const authController = require('~/controllers/Auth/authController')
const authControllerRegister = require('~/controllers/Auth/authControllerRegister')

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

router.post('/refresh', authController.requestRefreshToken)

router.post('/login-success', authController.loginSuccess)

router.post('/email-login', authControllerRegister.loginUser)

router.post('/register', authControllerRegister.registerUser)



module.exports = router