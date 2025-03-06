const { chatAiService } = require('~/services/AI/chatAiService')
async function chatAiController(req, res) {
    try {
        const { prompt } = req.body
        if (!prompt) return res.status(400).json({ error: 'Prompt is required' })

        const response = await chatAiService(prompt)
        res.json({ response })
    } catch (error) {
        console.error('Error in chatController:', error.message)
        res.status(500).json({ error: error.message })
    }
}

module.exports = { chatAiController }
