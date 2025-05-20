/* eslint-disable no-console */
const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('~/config/connectDB')
const path = require('path')

const authRouter = require('~/routes/v1/auth/authRouter')
const userRouter = require('~/routes/v1/user/userRouter')
const projectRouter = require('~/routes/v1/project/projectRouter')
const listRoutes = require('~/routes/v1/project/listRouter')
const taskRoutes = require('~/routes/v1/project/taskRouter')
const projectRoleRoutes = require('~/routes/v1/project/projectRoleRoutes')
const labelController = require('~/routes/v1/project/labelRouter')
const commentController = require('~/routes/v1/project/commentRouter')
const uploadController = require('~/routes/v1/project/uploadFileRouter')
const memberTaskRouter = require('~/routes/v1/project/memberTaskRouter')
const starredRouter = require('~/routes/v1/project/starredRouter')
const auditLogRouter = require('~/routes/v1/project/auditLogRouter')
const stripeRouter = require('~/routes/v1/project/stripeRouter')
const subscriptionplanRouter = require('~/routes/v1/project/subscriptionplanRouter')
const subscriptionRouter = require('~/routes/v1/project/subscriptionRouter')
const chatAiRouter = require('~/routes/v1/AI/chatAiRoutes')
const notificationRoutes = require('~/routes/v1/project/notificationRoutes')
const socketManager = require('~/sockets/socketManager')
const videoCallRouter = require('~/routes/v1/inbox/videoCallRouter')

const http = require('http')
const { Server } = require('socket.io')

const groupRoutes = require('~/routes/v1/chat/groupRouter')
const conversationRoutes = require('~/routes/v1/chat/conversationRouter')



require('~/utils/passport')
const { errorHandling } = require('~/middlewares/errorHandling')

const cookieParser = require('cookie-parser')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        credentials: true,
        origin: process.env.URL_CLIENT
    }
})

const socketIoInstance = socketManager(io)
app.use((req, res, next) => {
    req.io = socketIoInstance
    next()
})


app.use(cors({
    credentials: true,
    origin: process.env.URL_CLIENT
}))

app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const uploadsPath = path.join(__dirname, 'uploads/projects')
app.use('/uploads/projects', express.static(uploadsPath))

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/project', projectRouter)
app.use('/api/list', listRoutes)
app.use('/api/task', taskRoutes)
app.use('/api/project-role', projectRoleRoutes)
app.use('/api/label', labelController)
app.use('/api/comment', commentController)
app.use('/api/auditLog', auditLogRouter)
app.use('/api/file', uploadController)
app.use('/api/member-task', memberTaskRouter)

app.use('/api/starred', starredRouter) //////

app.use('/api/stripe', stripeRouter)

app.use('/api/subscription-plan', subscriptionplanRouter)

app.use('/api/subscription', subscriptionRouter)
app.use('/api/chat-ai', chatAiRouter)
app.use('/api/notifications', notificationRoutes)


app.use('/api/conversations', conversationRoutes)
app.use('/api/groups', groupRoutes)


app.use('/api/calls', videoCallRouter)

app.use(errorHandling)


const port = process.env.PORT

// eslint-disable-next-line no-console
server.listen(port, () => { console.log('Server is running on the port ' + port) })