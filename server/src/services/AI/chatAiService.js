const OpenAI = require('openai')
require('dotenv').config()

const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: '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',
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Local Development'
    }
});

async function chatAiService(prompt) {
    try {
        if (!prompt) throw new Error('Prompt is required');

        const completion = await client.chat.completions.create({
            model: 'google/gemini-2.0-flash-exp:free',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 2048,
            stream: false,
            fallbacks: ['anthropic/claude-2', 'openai/gpt-3.5-turbo'] // Added fallback models
        });

        if (!completion?.choices?.[0]?.message?.content) {
            throw new Error('Unexpected API response structure')
        }

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error in chatWithAI:', error.message)
        throw new Error(error.message)
    }
}
module.exports = { chatAiService }
