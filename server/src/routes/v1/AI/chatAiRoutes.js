const { chatAiController } = require('~/controllers/AI/chatAiController')
const router = require('express').Router()

router.post('/chat', chatAiController)

module.exports = router
