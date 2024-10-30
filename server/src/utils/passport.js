const GoogleStrategy = require('passport-google-oauth20').Strategy
require('dotenv').config()
const passport = require('passport')
const { v4: uuidv4 } = require('uuid')
const User = require('~/models/user') // Import the Mongoose user model
const { generateUniqueUsername } = require('~/utils/convertToUsername')
const getUsernameData = async () => {
    try {
        const users = await User.find({}, 'username'); // Truy vấn chỉ lấy trường username
        return users.map(user => user.username); // Trả về mảng username
    } catch (error) {
        console.error('Error fetching usernames:', error);
        return []; // Trả về mảng rỗng nếu có lỗi
    }
}
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
}, async function (accessToken, refreshToken, profile, cb) {
    const tokenLogin = uuidv4()
    console.log(profile)
    try {
        if (profile?.id) {
            let user = await User.findOne({ googleId: profile.id })

            if (!user) {
                user = await User.findOne({ email: profile.emails[0]?.value, googleId: { $exists: false } })

                if (user) {
                    user.googleId = profile.id
                    user.displayName = profile?.displayName
                    user.image = profile?.photos[0]?.value
                    user.tokenLogin = tokenLogin
                    await user.save()
                } else {
                    const usernameData = await getUsernameData();
                    const username = generateUniqueUsername(profile.displayName, usernameData);

                    // Kiểm tra xem username có hợp lệ không
                    if (!username) {
                        throw new Error('Username generation failed');
                    }

                    user = new User({
                        googleId: profile.id,
                        email: profile.emails[0]?.value,
                        displayName: profile?.displayName,
                        image: profile?.photos[0]?.value,
                        tokenLogin: tokenLogin,
                        username: username
                    })
                    try {
                        await user.save()
                    } catch (error) {
                        console.log(error)
                    }

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