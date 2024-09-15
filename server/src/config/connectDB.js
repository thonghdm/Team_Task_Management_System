/* eslint-disable no-console */
const mongoose = require('mongoose')
require('dotenv').config()

// Get the MongoDB connection string from environment variables
const DB = process.env.DATABASE

// Connect to MongoDB
mongoose.connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => console.log('Connected to MongoDB')).catch((err) => console.log('Error', err))