const { chatWithAI } = require('./openAi');

async function testChat() {
    try {
        const response = await chatWithAI('dep trai qua phai lam sao');
        console.log('AI Response:', response);
    } catch (error) {
        console.error('Test Error:', error.message);
    }
}

testChat();