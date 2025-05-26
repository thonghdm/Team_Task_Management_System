const { chatAiController, AiAssistantController } = require('~/controllers/AI/chatAiController')
const router = require('express').Router()

router.post('/chat', chatAiController)

router.post('/assign-tasks', AiAssistantController)

module.exports = router
