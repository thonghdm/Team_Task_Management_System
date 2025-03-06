const OpenAI = require('openai');
require('dotenv').config()

const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: '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',
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Local Development'
    }
});

async function chatWithAI(prompt) {
    try {
        // Changed to a more stable model
        const completion = await client.chat.completions.create({
            // model: 'anthropic/claude-3-sonnet',// Changed model
            model: 'moonshotai/moonlight-16b-a3b-instruct:free',
            messages: [
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2048,
            stream: false,
            fallbacks: ['anthropic/claude-2', 'openai/gpt-3.5-turbo'] // Added fallback models
        })

        if (completion?.error) {
            throw new Error(`API Error: ${completion.error.message}`);
        }

        if (!completion?.choices?.[0]?.message?.content) {
            throw new Error('Unexpected API response structure');
        }

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error in chat completion:', error.message);
        // Enhanced error logging
        if (error.response?.data) {
            console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
        }
        throw new Error(`Chat completion failed: ${error.message}`);
    }
}

module.exports = { chatWithAI };