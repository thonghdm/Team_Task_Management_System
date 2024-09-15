const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('~/config/connectDB')
const authRouter = require('~/routes/v1/auth/authRouter')
const userRouter = require('~/routes/v1/user/userRouter')
require('~/utils/passport')

const cookieParser = require('cookie-parser')

const app = express()

app.use(cors({
    credentials: true,
    origin: process.env.URL_CLIENT
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)


const port = process.env.PORT || 8888

// eslint-disable-next-line no-console
app.listen(port, () => { console.log('Server is running on the port ' + port) })