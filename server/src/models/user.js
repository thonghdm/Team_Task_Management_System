const mongoose = require('mongoose')

// Define the user schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // ensure email is unique and required
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    image: { type: String },
    displayName: String,
    tokenLogin: { type: String },
    is_active: { type: Boolean, default: true }, // whether the account is active
    refreshToken: String, // New field to store the refresh token
    isAdmin: { type: Boolean, default: false },
    verifiedForgotPassWord: { type: Number },
    phoneNumber: { type: String, default: '' },
    company: { type: String, default: '' },
    location: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    department: { type: String, default: '' }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User
