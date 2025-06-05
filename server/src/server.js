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
const chatFileRoutes = require('~/routes/v1/chat/chatFileRouter')

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

// Log current directory and paths for debugging
console.log('Current directory (__dirname):', __dirname)
console.log('Attempting to serve static files from:', path.join(__dirname, '../client/dist'))
console.log('Full absolute path:', path.resolve(__dirname, '../client/dist'))

// Try multiple possible paths
const possiblePaths = [
    path.join(__dirname, '../client/dist'),
    path.join(__dirname, '../../client/dist'),
    path.join(__dirname, '../../../client/dist'),
    path.resolve(__dirname, '../client/dist'),
    path.resolve(__dirname, '../../client/dist')
]

// Log all possible paths
possiblePaths.forEach((p, index) => {
    console.log(`Path ${index + 1}:`, p)
})

// Use the first path that exists
const staticPath = possiblePaths.find(p => {
    try {
        return require('fs').existsSync(p)
    } catch (e) {
        return false
    }
}) || possiblePaths[0]

console.log('Using static path:', staticPath)
app.use(express.static(staticPath))

app.get('*', (req, res) => {
    const indexPath = path.join(staticPath, 'index.html')
    console.log('Serving index.html from:', indexPath)
    res.sendFile(indexPath)
})

app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }))

app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const uploadsPath = path.join(__dirname, 'uploads/projects')
app.use('/uploads/projects', express.static(uploadsPath))

const chatUploadsPath = path.join(__dirname, 'uploads/chat')
app.use('/uploads/chat', express.static(chatUploadsPath))

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
app.use('/api/chat-files', chatFileRoutes)


app.use('/api/calls', videoCallRouter)

app.use(errorHandling)


const port = process.env.PORT

// eslint-disable-next-line no-console
server.listen(port, () => { console.log('Server is running on the port ' + port) })