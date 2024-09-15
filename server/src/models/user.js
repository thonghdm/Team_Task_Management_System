const mongoose = require('mongoose')

// Define the user schema
const userSchema = new mongoose.Schema({
    email: String,
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    image: String,
    displayName: String,
    tokenLogin: { type: String, default: '' },
    refreshToken: String, // New field to store the refresh token
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true })

// Create the user model
const User = mongoose.model('User', userSchema)

module.exports = User
