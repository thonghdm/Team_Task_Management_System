const GoogleStrategy = require('passport-google-oauth20').Strategy
require('dotenv').config()
const passport = require('passport')
const { v4: uuidv4 } = require('uuid')
const User = require('~/models/user') // Import the Mongoose user model

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
}, async function (accessToken, refreshToken, profile, cb) {
    const tokenLogin = uuidv4()

    try {
        if (profile?.id) {
            let user = await User.findOne({ googleId: profile.id })

            if (!user) {
                user = await User.findOne({ email: profile.emails[0]?.value, googleId: '' })

                if (user) {
                    user.googleId = profile.id
                    user.displayName = profile?.displayName
                    user.image = profile?.photos[0]?.value
                    user.tokenLogin = tokenLogin
                    await user.save()
                } else {
                    user = await User.create({
                        googleId: profile.id,
                        email: profile.emails[0]?.value,
                        displayName: profile?.displayName,
                        image: profile?.photos[0]?.value,
                        tokenLogin
                    })
                }
            } else {
                user.tokenLogin = tokenLogin
                await user.save()
            }
            profile = user
        }

    } catch (error) {
        return cb(error, null)
    }
    return cb(null, profile)
}
))